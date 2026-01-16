import { GoogleGenAI, Type } from "@google/genai";

/**
 * Hämtar API-nyckeln.
 * I Vite/Netlify-miljöer nås den via import.meta.env.VITE_GEMINI_API_KEY.
 */
const getApiKey = () => {
  // @ts-ignore
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.error("VITE_GEMINI_API_KEY saknas i miljövariabler!");
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
  if (!apiKey) throw new Error("API key is missing. Please check VITE_GEMINI_API_KEY.");

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
  if (!apiKey) throw new Error("API key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Rewrite this as a dramatic 80s power ballad in the style of the band Nestor: "${input}". Use [Verse] and [Chorus] markers.`,
  });
  return response.text;
};

export const generateAlbumArt = async (title: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key is missing.");

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