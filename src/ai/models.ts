import { env } from "@/env";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

export const models = {
  google: google("gemini-2.0-flash-001"),
};
