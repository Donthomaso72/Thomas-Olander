
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Super-robust JSON extraction.
 * Tries several methods to find valid JSON content in an AI response.
 */
const extractJSON = (text: string) => {
  if (!text) throw new Error("AI:n svarade med tom text.");
  
  try {
    // 1. Try direct parse
    return JSON.parse(text.trim());
  } catch (e) {
    try {
      // 2. Look for markdown blocks
      const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch) return JSON.parse(markdownMatch[1]);
      
      // 3. Look for the first { and last }
      const braceMatch = text.match(/\{[\s\S]*\}/);
      if (braceMatch) return JSON.parse(braceMatch[0]);
    } catch (innerE) {
      console.error("Failed all JSON extraction methods.", innerE);
    }
    
    console.error("Original AI Text:", text);
    throw new Error("Kunde inte tolka datan från AI:n. Försök igen!");
  }
};

export const generateRockPersona = async (name: string, favoriteFood: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a fun 80s hard rock stage name and persona for someone named "${name}" who likes "${favoriteFood}". 
      Return ONLY a JSON object with stageName, role, instrument, and backstory. Style: Nestor band vibe.`,
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
    
    return extractJSON(response.text || "{}");
  } catch (error) {
    console.error("Gemini Persona Error:", error);
    throw new Error("Kunde inte generera rock-persona. Kontrollera din anslutning.");
  }
};

export const rewriteAsBallad = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Rewrite the following boring text as a dramatic, epic 80s power ballad in the style of Nestor. 
      Input: "${input}"
      Structure with [Verse], [Pre-Chorus], and [Chorus].`,
    });
    return response.text || "Tyvärr blev balladen tyst som i graven. Försök igen!";
  } catch (error) {
    console.error("Gemini Ballad Error:", error);
    throw new Error("Kunde inte skriva balladen just nu.");
  }
};

export const generateAlbumArt = async (title: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { text: `An 80s melodic hard rock album cover for a band called NESTOR. The album title is "${title}". 
          Aesthetic: Neon pink and cyan color palette, grid background, chrome lettering, nostalgic 1989 vibe.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Ingen bilddata hittades.");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};
