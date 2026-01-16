
import { GoogleGenAI, Type } from "@google/genai";

// Standardizing API key retrieval for the environment
const getApiKey = () => {
  return process.env.API_KEY || "";
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
    throw new Error("Kunde inte tolka rock-datan från AI Studio.");
  }
};

export const generateRockPersona = async (name: string, favoriteFood: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Skapa en 80-tals rockstjärne-persona för ${name} som älskar ${favoriteFood}.`,
    config: {
      systemInstruction: "Du är en legendarisk manager från 1989. Du älskar svensk AOR och band som Nestor. Använd uttryck som 'Grymt!', 'Helt magiskt!' och 'Rock on!'. Svara strikt med JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stageName: { type: Type.STRING, description: "Ett kraftfullt artistnamn" },
          role: { type: Type.STRING, description: "Position i bandet" },
          instrument: { type: Type.STRING, description: "Klassiskt 80-talsinstrument" },
          backstory: { type: Type.STRING, description: "En historia med referenser till Falköping, 80-talet och hårspray." }
        },
        required: ["stageName", "role", "instrument", "backstory"]
      }
    }
  });
  return extractJSON(response.text);
};

export const rewriteAsBallad = async (input: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Skriv om detta vardagliga problem till en episk Nestor-ballad: "${input}"`,
    config: {
      systemInstruction: "Du skriver texter i samma anda som Nestors 'Kids in a Ghost Town'. Fokusera på nostalgi, barndomsvänner och att aldrig ge upp sina drömmar. Använd [Verse], [Chorus] och beskriv var ett gitarrsolo kommer in.",
      temperature: 0.9,
    }
  });
  return response.text;
};

export const generateAlbumArt = async (title: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: `A high-quality 80s melodic rock album cover. Title: "${title}". Band: NESTOR. Style: Retro-futuristic, neon lights, grid floors, Falköping city vibes at night, chrome typography, vibrant pink and cyan palette. Cinematic lighting, highly detailed.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    },
  });

  // Extracting the image from candidates parts
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    const part = candidate.content.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Kunde inte generera bild. Försök igen om en stund.");
};
