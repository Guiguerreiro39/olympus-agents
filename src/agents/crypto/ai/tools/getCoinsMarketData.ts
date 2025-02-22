import { tool } from "ai";
import { z } from "zod";
import { advancedCoinFilter } from "@/agents/crypto/helpers/advancedCoinFilter";
import {
  getCoinGeckoCoinsList,
  getKrakenMarkets,
  getMarketData,
} from "@/agents/crypto/methods";

export const getCoinsMarketData = tool({
  description: "Retrieve cryptocurrency market data",
  parameters: z.object({}),
  execute: async () => {
    const krakenMarkets = await getKrakenMarkets();
    const coinList = await getCoinGeckoCoinsList();
    const marketData = await getMarketData({ krakenMarkets, coinList });

    return advancedCoinFilter(marketData).splice(0, 50);
  },
});
