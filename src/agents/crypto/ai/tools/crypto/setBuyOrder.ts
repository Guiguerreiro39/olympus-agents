import { tool } from "ai";
import { z } from "zod";
import { setKrakenBuyOrder } from "@/agents/crypto/methods/setKrakenBuyOrder";

export const setBuyOrder = tool({
  description: "Buy a cryptocurrency based on the provided parameters",
  parameters: z.object({
    symbol: z.string().describe("Coin symbol"),
    amount: z.number().describe("Amount to buy in EUR"),
    buyPrice: z.number().describe("Buy price in EUR"),
    profitPrice: z.number().describe("Take profit price in EUR"),
    stopPrice: z.number().describe("Stop loss price in EUR"),
  }),
  execute: setKrakenBuyOrder,
});
