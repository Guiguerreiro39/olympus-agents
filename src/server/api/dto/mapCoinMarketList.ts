import {
  coinMarketListSchema,
  type CoinMarketList,
} from "@/agents/crypto/types";
import { isArray, isObject } from "@/utils/parse";
import { z } from "zod";

export const mapCoinMarketList = (input: unknown): CoinMarketList => {
  if (!isArray(input))
    throw new Error("Failed to map coin market list: input is not an array");

  const resultArray: CoinMarketList = input.map((result) => {
    if (!isObject(result))
      throw new Error("Failed to map coin market list: input is not an object");

    return {
      id: z.string().parse(result.id),
      name: z.string().parse(result.name),
      symbol: z.string().parse(result.symbol),

      allTimeHigh:
        z.coerce.number().optional().nullable().parse(result.ath) ?? null,
      allTimeHighChangePercentage:
        z.coerce
          .number()
          .optional()
          .nullable()
          .parse(result.ath_change_percentage) ?? null,
      allTimeHighDate:
        z.string().optional().nullable().parse(result.ath_date) ?? null,

      allTimeLow:
        z.coerce.number().optional().nullable().parse(result.atl) ?? null,
      allTimeLowChangePercentage:
        z.coerce
          .number()
          .optional()
          .nullable()
          .parse(result.atl_change_percentage) ?? null,
      allTimeLowDate:
        z.string().optional().nullable().parse(result.atl_date) ?? null,

      circulatingSupply:
        z.coerce
          .number()
          .optional()
          .nullable()
          .parse(result.circulating_supply) ?? null,
      currentPrice: z.coerce.number().parse(result.current_price),
      fullyDilutedValuation:
        z.coerce
          .number()
          .optional()
          .nullable()
          .parse(result.fully_diluted_valuation) ?? null,
      high24h: z.coerce.number().parse(result.high_24h),
      low24h: z.coerce.number().parse(result.low_24h),

      marketCap: z.coerce.number().parse(result.market_cap),
      marketCapChange24h:
        z.coerce
          .number()
          .optional()
          .nullable()
          .parse(result.market_cap_change_24h) ?? null,
      marketCapChangePercentage24h: z.coerce
        .number()
        .parse(result.market_cap_change_percentage_24h),
      marketCapRank: z.coerce.number().parse(result.market_cap_rank),

      maxSupply:
        z.coerce.number().optional().nullable().parse(result.max_supply) ??
        null,
      priceChange24h:
        z.coerce
          .number()
          .optional()
          .nullable()
          .parse(result.price_change_24h) ?? null,
      priceChangePercentage1hInCurrency: z.coerce
        .number()

        .parse(result.price_change_percentage_1h_in_currency),
      priceChangePercentage24h: z.coerce
        .number()

        .parse(result.price_change_percentage_24h),
      roi:
        z
          .object({
            currency: z.string(),
            percentage: z.number(),
            times: z.number(),
          })
          .optional()
          .nullable()
          .parse(result.roi) ?? null,

      sparklineIn7d: z
        .object({
          price: z.array(z.coerce.number()),
        })

        .parse(result.sparkline_in_7d),

      totalSupply:
        z.coerce.number().optional().nullable().parse(result.total_supply) ??
        null,
      totalVolume:
        z.coerce.number().optional().nullable().parse(result.total_volume) ??
        null,
    };
  });

  return coinMarketListSchema.parse(resultArray);
};
