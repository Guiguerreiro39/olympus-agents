import {
  krakenMarketsSchema,
  type ValidObject,
  type KrakenMarkets,
} from "@/agents/crypto/types";
import { isObject } from "@/lib/dto/parse";

import { z } from "zod";

export const mapKrakenMarkets = (input: unknown): KrakenMarkets => {
  if (!isObject(input))
    throw new Error("Failed to map Kraken markets: input is not an object");

  const resultArray: KrakenMarkets = [];

  for (const result of Object.values(input) as ValidObject[]) {
    resultArray.push({
      id: z.string().parse(result.id),
      name: z.string().parse(result.altname),
      symbol: z.string().parse(result.symbol),
      base: z.string().parse(result.base),
      quote: z.string().parse(result.quote),
    });
  }

  return krakenMarketsSchema.parse(resultArray);
};
