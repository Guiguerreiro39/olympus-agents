import { models } from "@/ai/models";
import {
  system as cryptoSystemPrompt,
  prompt as cryptoUserPrompt,
} from "@/agents/crypto/ai/prompts";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateText } from "ai";
import { getBalance } from "@/agents/crypto/ai/tools/getBalance";
import { getCoinsMarketData } from "@/agents/crypto/ai/tools/getCoinsMarketData";
import { setBuyOrder } from "@/agents/crypto/ai/tools/setBuyOrder";
import { getKrakenEURBalance } from "@/agents/crypto/methods";

export const cryptoRouter = createTRPCRouter({
  cryptoTradingAgent: publicProcedure.query(async () => {
    const balance = await getKrakenEURBalance();

    if (balance < 20) {
      return { text: "Insufficient balance" };
    }

    const response = await generateText({
      model: models.google,
      system: cryptoSystemPrompt,
      prompt: cryptoUserPrompt,
      tools: {
        getBalance,
        getCoinsMarketData,
        setBuyOrder,
      },
      maxSteps: 3,
    });

    return response.text;
  }),
});
