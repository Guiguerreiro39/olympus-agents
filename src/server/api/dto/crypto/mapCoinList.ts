import {
  type ValidObject,
  coinListSchema,
  type CoinList,
} from "@/agents/crypto/types";
import { isArray, isObject } from "@/lib/dto/parse";
import { z } from "zod";

export const mapCoinList = (input: unknown): CoinList => {
  if (!isArray(input))
    throw new Error("Failed to map coin list: input is not an array");

  const resultArray: ValidObject[] = input.map((result) => {
    if (!isObject(result))
      throw new Error("Failed to map coin list: input is not an object");

    return {
      id: z.string().parse(result.id),
      name: z.string().optional().parse(result.name) ?? null,
      symbol: z.string().parse(result.symbol),
      platforms: mapPlatforms(result.platforms),
    };
  });

  return coinListSchema.parse(resultArray);
};

const mapPlatforms = (input: unknown): CoinList[number]["platforms"] => {
  if (!isObject(input))
    throw new Error("Failed to map platforms: input is not an object");

  const resultArray = Object.entries(input).map(([key, value]) => {
    return {
      market: z.string().parse(key),
      link: z.string().parse(value),
    };
  });

  return resultArray;
};
