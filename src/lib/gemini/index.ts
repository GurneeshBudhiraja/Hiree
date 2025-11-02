"use server";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_2_POINT_5_FLASH_MODEL, GEMINI_PARSE_RESUME_PROMPT } from "./gemini-constants";


async function getGeminiClient() {
  try {
    return new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API! });
  } catch (error) {
    console.log("Error in `getGeminiClient` in gemini.ts:", (error as Error).message);
    return null;
  }
}


export async function geminiParseResume(resumeBase64String: string) {
  try {
    console.log("🏃‍➡️ Parsing the resume using Gemini API...")
    const geminiClient = await getGeminiClient();
    if (!geminiClient) {
      console.log("❌ Failed to initialize Gemini client in `geminiParseResume` in gemini.ts");
      return null;
    }
    const contents = [
      { text: GEMINI_PARSE_RESUME_PROMPT },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: resumeBase64String,
        }
      }
    ];

    const response = await geminiClient.models.generateContent({
      model: GEMINI_2_POINT_5_FLASH_MODEL,
      contents: contents
    });
    console.log("🔍 The resume has been parsed successfully using Gemini API.");
    return response.text ?? null;

  } catch (error) {
    console.log("⚠️ Error in `geminiParseResume` in gemini.ts:", (error as Error).message);
    return null;
  }
}