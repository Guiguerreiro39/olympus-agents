import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { env } from "@/env";

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

export const model = google("gemini-2.0-flash-001");
