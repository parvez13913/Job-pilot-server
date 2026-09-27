import { GoogleGenAI } from "@google/genai";

import config from ".";

if (!config.gemini.apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

export const gemini = new GoogleGenAI({
  apiKey: config.gemini.apiKey,
});
