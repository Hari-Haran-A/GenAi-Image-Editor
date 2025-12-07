import { GoogleGenAI } from "@google/genai";

// The specific model for image editing/generation as per instructions
const MODEL_NAME = 'gemini-2.5-flash-image';

// Helper to sanitize keys (remove whitespace, newlines, invisible chars)
const sanitizeKey = (key: string | undefined): string | undefined => {
  if (!key) return undefined;
  return key.replace(/\s+/g, '').trim();
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  const cleanKey = sanitizeKey(apiKey);
  if (!cleanKey) return false;

  try {
    const ai = new GoogleGenAI({ apiKey: cleanKey });
    // Minimal request to check auth using a cheap text model
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: 'test' }] },
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (error: any) {
    console.warn("API Key Validation Failed:", error.message);
    return false;
  }
};

export const generateEditedImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  customApiKey?: string
): Promise<string> => {
  try {
    // Prioritize custom user key, fall back to environment variable
    const cleanCustomKey = sanitizeKey(customApiKey);
    const apiKey = cleanCustomKey || process.env.API_KEY;
    
    // Explicitly check for API key to handle browser/deployment environments gracefully
    if (!apiKey) {
      throw new Error("API_KEY_MISSING");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated from the model.");
    }

    let foundImageBase64: string | null = null;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        foundImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (foundImageBase64) {
      // Convert raw base64 to data URI for display
      return `data:image/png;base64,${foundImageBase64}`;
    } else {
      // Fallback: Check if there's text explanation if image failed
      const textPart = parts.find(p => p.text);
      if (textPart?.text) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
      }
      throw new Error("The model did not return a valid image.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for specific API Key errors from Google's response
    const errorMessage = error.message?.toLowerCase() || error.toString().toLowerCase();
    
    if (errorMessage.includes("api key not valid") || 
        errorMessage.includes("api_key_invalid") || 
        errorMessage.includes("invalid argument") && errorMessage.includes("key")) {
      throw new Error("INVALID_API_KEY");
    }

    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    
    throw new Error(error.message || "Failed to edit image.");
  }
};