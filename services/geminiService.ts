import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "../types";

// The specific model for image editing/generation as per instructions
const GEMINI_MODEL_NAME = 'gemini-2.5-flash-image';

// Helper to resize/crop for OpenAI (OpenAI requires square PNGs < 4MB)
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
  
  // SANITIZE KEY: Remove all whitespace/newlines which cause "Failed to fetch" in headers
  const cleanKey = apiKey ? apiKey.trim() : '';

  // 1. Google Gemini Logic
  if (provider === 'google') {
    const key = cleanKey || process.env.API_KEY;
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
      
      // Standardize errors
      const msg = error.message || error.toString();
      if (error.status === 429 || msg.includes('429')) throw new Error("QUOTA_EXCEEDED");
      if (msg.includes("API_KEY") || error.status === 400) throw new Error("INVALID_API_KEY");
      if (msg.includes("Failed to fetch")) throw new Error("NETWORK_ERROR");
      
      throw error;
    }
  }

  // 2. OpenAI Logic
  if (provider === 'openai') {
    if (!cleanKey) throw new Error("API_KEY_MISSING");
    
    try {
        const imageBlob = await prepareImageForOpenAI(base64Image, mimeType);
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
                'Authorization': `Bearer ${cleanKey}` // Clean key is crucial here
            },
            body: formData
        });

        // Safe JSON parsing
        let data;
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("OpenAI Non-JSON Response:", text);
            throw new Error(`OpenAI API returned non-JSON error: ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
            const errorMsg = data.error?.message || "OpenAI API failed";
            if (errorMsg.includes("billing") || errorMsg.includes("quota")) {
                throw new Error("BILLING_LIMIT_REACHED");
            }
            if (errorMsg.includes("invalid api key")) {
                throw new Error("INVALID_API_KEY");
            }
            throw new Error(errorMsg);
        }

        if (data.data && data.data.length > 0) {
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
               return imgUrl; 
            }
        }
        throw new Error("No image data received from OpenAI");

    } catch (error: any) {
        console.error("OpenAI Error:", error);
        if (error.message.includes("Failed to fetch")) throw new Error("NETWORK_ERROR");
        throw error;
    }
  }

  throw new Error("Invalid Provider");
};