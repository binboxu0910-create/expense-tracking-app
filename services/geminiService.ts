
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const smartCategorize = async (merchant: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Categorize this merchant: "${merchant}". Choose the best fit from these IDs: cat-food, cat-ent, cat-shop, cat-trans, cat-housing, cat-utils, cat-health, cat-edu, cat-travel, cat-subs, cat-other. Return ONLY the ID.`,
      config: {
        responseMimeType: "text/plain",
        temperature: 0.1,
      }
    });

    // Directly access the text property as it is a getter.
    const categoryId = response.text?.trim();
    return categoryId || null;
  } catch (error) {
    console.error("Gemini smart categorization failed:", error);
    return null;
  }
};
