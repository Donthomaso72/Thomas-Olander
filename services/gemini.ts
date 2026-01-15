
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Hämtar API-nyckeln.
 * På Netlify MÅSTE variabeln heta VITE_GEMINI_API_KEY för att synas i frontend.
 */
const getApiKey = () => {
  // @ts-ignore - import.meta.env är standard i Vite/Netlify
  const viteKey = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.VITE_GEMINI_API_KEY : null;
  
  // Fallback för andra miljöer
  const processKey = typeof process !== 'undefined' ? process.env.API_KEY : null;
  
  const key = viteKey || processKey || "";

  if (!key) {
    console.error("API_KEY_MISSING: Kontrollera att VITE_GEMINI_API_KEY är satt i Netlify Settings -> Environment Variables.");
  }
  return key;
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

  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Ingen bild kunde skapas.");
};
