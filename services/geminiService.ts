import { GoogleGenAI } from "@google/genai";
import { Ingredient } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSummitReflection = async (inventory: Ingredient[], distance: number) => {
  const model = 'gemini-2.5-flash';
  
  const inventoryNames = inventory.map(i => i.name).join(', ');
  
  const prompt = `
    You are the inner monologue of a 30-year-old woman who just finished a grueling hike after buying vegetables at a market.
    She has reached the summit. The game style is "Gentle Monster" - abstract, futuristic, minimalist, slightly weird but profound.
    
    Context:
    - She cooked: ${inventoryNames || "Nothing specific"}
    - She hiked distance: ${distance} meters.
    
    Write a very short, poetic, abstract reflection (max 40 words).
    It should connect the act of buying vegetables (survival, routine) with the act of climbing (struggle, elevation).
    Format it like a piece of modern art text. Use line breaks creatively.
    Do NOT contain hashtags.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return "OXYGEN THIN.\nREALITY SHIFTING.\nI AM ALIVE.";
  }
};
