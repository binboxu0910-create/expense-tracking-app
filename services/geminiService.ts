import { GoogleGenAI } from "@google/genai";

// ✅ Vite 前端环境变量：必须以 VITE_ 开头
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

// ✅ 有 key 才创建 client（关键！）
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!apiKey) return null;
  if (!ai) ai = new GoogleGenAI({ apiKey });
  return ai;
}

// 可选：给 UI 用
export const isGeminiEnabled = () => Boolean(apiKey);

export const smartCategorize = async (merchant: string): Promise<string | null> => {
  const client = getAI();
  if (!client) return null; // ✅ 没 key：直接返回，不崩

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this merchant: "${merchant}". Choose the best fit from these IDs: cat-food, cat-ent, cat-shop, cat-trans, cat-housing, cat-utils, cat-health, cat-edu, cat-travel, cat-subs, cat-other. Return ONLY the ID.`,
      config: {
        responseMimeType: "text/plain",
        temperature: 0.1,
      },
    });

    const categoryId = response.text?.trim();
    return categoryId || null;
  } catch (error) {
    console.error("Gemini smart categorization failed:", error);
    return null;
  }
};
