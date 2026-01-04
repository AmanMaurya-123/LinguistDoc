
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const translateToEnglish = async (text: string, sourceLang: string = "auto-detect"): Promise<string> => {
  try {
    const ai = getAIClient();
    
    const systemInstruction = `
      You are a professional linguist and translator specializing in translating various languages into fluent, natural English.
      Your goal is to provide a translation that is not just word-for-word, but contextually accurate and captures nuances.
      
      RULES:
      1. Always translate into English.
      2. If source language is "${sourceLang}" and not "auto-detect", use that as context.
      3. Maintain the tone and formatting of the original text.
      4. Only return the translated text without any conversational filler or "Here is your translation" prefixes.
      5. If the input is already in English, return it as is or slightly polish it for better flow.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text into English: \n\n${text}`,
      config: {
        systemInstruction,
        temperature: 0.3, // Low temperature for consistent translation
      },
    });

    return response.text || "No translation generated.";
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error("Failed to translate text. Please check your connection or API key.");
  }
};
