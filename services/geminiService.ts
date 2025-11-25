import { GoogleGenAI, Type } from "@google/genai";
import { ElementType, GenerationResponse } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a satellite image (base64) and generates a layout JSON.
 */
export const generateLayoutFromImage = async (base64Image: string): Promise<GenerationResponse> => {
  const modelId = "gemini-2.5-flash"; // Multimodal support

  const prompt = `
    Analyze this satellite image (or map) of a school or potential construction site.
    Identify likely locations for buildings, sports fields, and roads.
    
    Generate a JSON list of 3D objects to reconstruct this scene abstractly.
    The coordinate system is:
    - Ground is at y=0.
    - X and Z axes range roughly from -50 to 50.
    - Buildings should be taller (scale y > 1).
    - Fields and Roads should be flat (scale y approx 0.1).
    
    Return a valid JSON object matching the schema.
  `;

  // Remove data URL prefix if present for the API call
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", // Assuming PNG or JPEG, API is flexible
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: [ElementType.BUILDING, ElementType.ROAD, ElementType.FIELD, ElementType.TREE]
                  },
                  name: { type: Type.STRING },
                  position: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    minItems: 3,
                    maxItems: 3
                  },
                  rotation: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    minItems: 3,
                    maxItems: 3
                  },
                  scale: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    minItems: 3,
                    maxItems: 3
                  },
                  color: { type: Type.STRING }
                },
                required: ["type", "name", "position", "rotation", "scale", "color"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GenerationResponse;
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw error;
  }
};

/**
 * Generates a layout based on a text description.
 */
export const generateLayoutFromText = async (description: string): Promise<GenerationResponse> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    Create a 3D layout for a school based on this description: "${description}".
    Generate a JSON list of 3D objects (Buildings, Roads, Fields, Trees).
    
    Coordinate system: Ground y=0, X/Z approx -50 to 50.
    Buildings should be tall. Fields flat.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: [ElementType.BUILDING, ElementType.ROAD, ElementType.FIELD, ElementType.TREE]
                  },
                  name: { type: Type.STRING },
                  position: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    minItems: 3,
                    maxItems: 3
                  },
                  rotation: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    minItems: 3,
                    maxItems: 3
                  },
                  scale: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    minItems: 3,
                    maxItems: 3
                  },
                  color: { type: Type.STRING }
                },
                required: ["type", "name", "position", "rotation", "scale", "color"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GenerationResponse;
  } catch (error) {
    console.error("Gemini Text Generation Error:", error);
    throw error;
  }
};
