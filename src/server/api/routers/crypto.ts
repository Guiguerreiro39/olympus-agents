import { model } from "@/ai/models/google";
import {
  system as cryptoSystemPrompt,
  prompt as cryptoUserPrompt,
} from "@/agents/crypto/ai/prompts/crypto";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateText } from "ai";
import { getBalance } from "@/agents/crypto/ai/tools/crypto/getBalance";
import { getCoinsMarketData } from "@/agents/crypto/ai/tools/crypto/getCoinsMarketData";
import { setBuyOrder } from "@/agents/crypto/ai/tools/crypto/setBuyOrder";

export const cryptoRouter = createTRPCRouter({
  cryptoTradingAgent: publicProcedure.query(async () => {
    const response = await generateText({
      model,
      system: cryptoSystemPrompt,
      prompt: cryptoUserPrompt,
      tools: {
        getBalance,
        getCoinsMarketData,
        setBuyOrder,
      },
      maxSteps: 3,
    });

    console.log(response.text);

    return response.text;
  }),
});
