import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "../types";

// The specific model for image editing/generation as per instructions
const GEMINI_MODEL_NAME = 'gemini-2.5-flash-image';

// Helper to resize/crop for OpenAI (OpenAI requires square PNGs < 4MB)
// This is a basic implementation to ensure the API call doesn't immediately fail on non-square images
const prepareImageForOpenAI = async (base64: string, mimeType: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height);
      // Limit to 1024x1024 max for cost/performance
      const targetSize = Math.min(size, 1024);
      
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error("Canvas context failed")); return; }

      // Draw center crop
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, targetSize, targetSize);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Blob creation failed"));
      }, 'image/png'); // OpenAI requires PNG
    };
    img.onerror = reject;
    img.src = `data:${mimeType};base64,${base64}`;
  });
};

const createTransparentMask = (size: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject(new Error("Canvas context failed")); return; }
    
    // Fill with transparent (default) but let's be explicit
    ctx.clearRect(0, 0, size, size);
    
    canvas.toBlob((blob) => {
        if(blob) resolve(blob);
        else reject(new Error("Mask blob creation failed"));
    }, 'image/png');
  });
}

export const generateEditedImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  apiKey?: string,
  provider: AIProvider = 'google'
): Promise<string> => {
  
  // 1. Google Gemini Logic
  if (provider === 'google') {
    const key = apiKey || process.env.API_KEY;
    if (!key) throw new Error("API_KEY_MISSING");

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            { text: prompt },
          ],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) throw new Error("No content generated.");

      let foundImageBase64: string | null = null;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          foundImageBase64 = part.inlineData.data;
          break; 
        }
      }

      if (foundImageBase64) {
        return `data:image/png;base64,${foundImageBase64}`;
      } else {
        const textPart = parts.find(p => p.text);
        if (textPart?.text) throw new Error(`Model returned text: ${textPart.text}`);
        throw new Error("No image returned.");
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.status === 429 || error.message?.includes('429')) throw new Error("QUOTA_EXCEEDED");
      if (error.message.includes("API_KEY")) throw new Error("API_KEY_MISSING");
      throw error;
    }
  }

  // 2. OpenAI Logic
  if (provider === 'openai') {
    if (!apiKey) throw new Error("API_KEY_MISSING");
    
    try {
        // OpenAI Edits Endpoint requires multipart/form-data
        // It requires: image (square PNG < 4MB), mask (optional, but needed for 'edit'), prompt
        
        const imageBlob = await prepareImageForOpenAI(base64Image, mimeType);
        // Create a mask to allow editing the whole image or specific parts. 
        // For this generic "editor", we'll provide a transparent mask so the model CAN regenerate pixels.
        // *However*, DALL-E 2 edits often expect a mask where transparent = keep, colored = replace? 
        // Actually: Transparent areas of the mask indicate where the image should be edited.
        // So a fully transparent mask = edit everything based on prompt.
        const maskBlob = await createTransparentMask(1024); 

        const formData = new FormData();
        formData.append('image', imageBlob, 'image.png');
        formData.append('mask', maskBlob, 'mask.png');
        formData.append('prompt', prompt);
        formData.append('n', '1');
        formData.append('size', '1024x1024');

        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
                // Content-Type is set automatically by FormData
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "OpenAI API failed");
        }

        if (data.data && data.data.length > 0) {
            // OpenAI returns a URL usually, or b64_json if requested. 
            // Default is url. We'll use the URL.
            // Note: URL might expire, better to fetch it and convert to base64 if we want persistence, 
            // but for now let's just use the URL proxy or fetch it.
            // To be safe with CORS and expiration, let's try to fetch the blob and convert to data URI.
            const imgUrl = data.data[0].url;
            try {
               const imgRes = await fetch(imgUrl);
               const imgBlob = await imgRes.blob();
               return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(imgBlob);
               });
            } catch (e) {
               return imgUrl; // Fallback
            }
        }
        throw new Error("No image data received from OpenAI");

    } catch (error: any) {
        console.error("OpenAI Error:", error);
        throw new Error(error.message || "OpenAI Generation Failed");
    }
  }

  throw new Error("Invalid Provider");
};
