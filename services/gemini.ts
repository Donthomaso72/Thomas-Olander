import { GoogleGenAI, Type } from "@google/genai";

/**
 * Retrieves the API key.
 * On Netlify, make sure to add VITE_GEMINI_API_KEY to Site Settings -> Environment Variables.
 */
const getApiKey = () => {
  // Check for Vite/Netlify specific variable first
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  
  // Fallback for local process.env or other environments
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }

  // Final fallback (can be empty string, but logic will check for truthiness)
  return "";
};

const extractJSON = (text: string) => {
  try {
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch) return JSON.parse(markdownMatch[1]);
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) return JSON.parse(braceMatch[0]);
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("JSON Extraction Error:", e);
    throw new Error("Kunde inte tolka rock-datan.");
  }
};

export const generateRockPersona = async (name: string, favoriteFood: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a fun 80s hard rock stage name and persona for someone named "${name}" who likes "${favoriteFood}". Return ONLY a JSON object.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stageName: { type: Type.STRING },
          role: { type: Type.STRING },
          instrument: { type: Type.STRING },
          backstory: { type: Type.STRING }
        },
        required: ["stageName", "role", "instrument", "backstory"]
      }
    }
  });
  return extractJSON(response.text);
};

export const rewriteAsBallad = async (input: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Rewrite this as a dramatic 80s power ballad in the style of the band Nestor: "${input}". Use [Verse] and [Chorus] markers.`,
  });
  return response.text;
};

export const generateAlbumArt = async (title: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `An 80s melodic hard rock album cover for the band NESTOR. Title: "${title}". Neon pink, cyan, chrome, grid background, retro futuristic.`,
        },
      ],
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Ingen bild kunde skapas.");
};