import { GoogleGenAI } from "@google/genai";

// The specific model for image editing/generation as per instructions
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateEditedImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  customApiKey?: string
): Promise<string> => {
  try {
    // Prioritize the custom key (from UI), fallback to env var
    const apiKey = customApiKey || process.env.API_KEY;
    
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

    // Check for rate limiting / quota exhaustion (HTTP 429)
    // The error object structure can vary, so we check multiple properties
    if (
      error.status === 429 || 
      error.code === 429 || 
      error.message?.includes('429') || 
      error.message?.includes('quota') ||
      error.message?.includes('RESOURCE_EXHAUSTED')
    ) {
       throw new Error("QUOTA_EXCEEDED");
    }

    if (error.message.includes("API_KEY_MISSING")) {
        throw new Error("API_KEY_MISSING");
    }
    throw new Error(error.message || "Failed to edit image.");
  }
};