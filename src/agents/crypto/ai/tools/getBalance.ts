import { tool } from "ai";
import { z } from "zod";
import { getKrakenEURBalance } from "@/agents/crypto/methods/getKrakenBalance";

export const getBalance = tool({
  description: "Retrieve the current free EUR balance in the account",
  parameters: z.object({}),
  execute: getKrakenEURBalance,
});
