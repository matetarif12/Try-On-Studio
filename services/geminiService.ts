import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { ClothingItem } from '../types';

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBase64(dataUrl: string): string {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) {
        throw new Error("Invalid data URL format");
    }
    return parts[1];
}

async function getImageBase64(source: string): Promise<string> {
    if (source.startsWith('data:')) {
        return dataUrlToBase64(source);
    }
    return urlToBase64(source);
}

export const generateStyledImage = async (baseImageUrl: string, items: ClothingItem[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const itemNames = items.map(item => item.name).join(', ');
  const prompt = `
**TASK:** Your sole task is to photorealistically dress the mannequin in the provided base image with the clothing items from the reference images.

**STRICT RULES:**
- **DO NOT CHANGE THE MANNEQUIN:** The mannequin's pose, body shape, skin tone, facial features, and position MUST remain completely unchanged.
- **DO NOT CHANGE THE BACKGROUND:** The background of the base image must be preserved exactly.
- **DO NOT CHANGE THE LIGHTING:** Maintain the original lighting of the base image.
- **USE REFERENCE IMAGES:** Each clothing item must match its reference image in style, color, and texture as closely as possible.
- **FINAL IMAGE:** The output should be a single image of the mannequin wearing the specified clothes: ${itemNames}.
  `.trim();

  try {
    const baseImageB64 = await getImageBase64(baseImageUrl);
    
    const itemImageB64s = await Promise.all(items.map(item => getImageBase64(item.imageUrl)));
    
    const imageParts = [
      { inlineData: { mimeType: 'image/jpeg', data: baseImageB64 } },
      ...itemImageB64s.map(data => ({ inlineData: { mimeType: 'image/png', data } }))
    ];

    const textPart = { text: prompt };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [textPart, ...imageParts] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    const firstPart = response.candidates?.[0]?.content?.parts?.[0];

    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    } else {
        throw new Error("No image data found in the API response.");
    }

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('400')) {
             throw new Error("The request was invalid. The model may not be able to process the provided images.");
        }
    }
    throw new Error("Failed to generate the styled image. Please check the console for details.");
  }
};

export const generateRandomClothingItem = async (): Promise<{ name: string; imageUrl: string }> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Step 1: Generate a description for a clothing item
    const descriptionPrompt = "Describe a single, common, and stylish clothing item for a photorealistic image generation model. Be specific about the type and color. For example: 'a black leather biker jacket' or 'a pair of classic blue jeans' or 'a stylish white linen summer dress'.";
    const descriptionResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: descriptionPrompt,
    });
    const itemName = descriptionResponse.text.trim().replace(/"/g, ''); // Clean quotes

    // Step 2: Generate the image based on the description
    const imageGenerationPrompt = `${itemName}, on a plain white background, studio lighting, photorealistic. The image should be a PNG with a transparent background.`;

    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: imageGenerationPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = imageResponse.candidates?.[0]?.content?.parts?.[0];

    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        const imageUrl = `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
        // Capitalize the first letter of the item name for display
        const displayName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
        return { name: displayName, imageUrl };
    } else {
        throw new Error("Failed to generate clothing item image.");
    }
};

export const generateDescribedClothingItem = async (description: string): Promise<{ name: string; imageUrl: string }> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
     if (!description) {
        throw new Error("Description cannot be empty.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const itemName = description.trim();

    const imageGenerationPrompt = `${itemName}, on a plain white background, studio lighting, photorealistic, PNG with a transparent background.`;

    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imageGenerationPrompt }] },
        config: { responseModalities: [Modality.IMAGE] },
    });
    
    const firstPart = imageResponse.candidates?.[0]?.content?.parts?.[0];

    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        const imageUrl = `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
        const displayName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
        return { name: displayName, imageUrl };
    } else {
        throw new Error("Failed to generate clothing item image from description.");
    }
};