import { z } from "zod";

export const coinMarketDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  allTimeHigh: z.number().nullable(),
  allTimeHighChangePercentage: z.number().nullable(),
  allTimeHighDate: z.string().nullable(),
  allTimeLow: z.number().nullable(),
  allTimeLowChangePercentage: z.number().nullable(),
  allTimeLowDate: z.string().nullable(),
  circulatingSupply: z.number().nullable(),
  currentPrice: z.number(),
  fullyDilutedValuation: z.number().nullable(),
  high24h: z.number(),
  low24h: z.number(),
  marketCap: z.number(),
  marketCapChange24h: z.number().nullable(),
  marketCapChangePercentage24h: z.number(),
  marketCapRank: z.number(),
  maxSupply: z.number().nullable(),
  priceChange24h: z.number().nullable(),
  priceChangePercentage1hInCurrency: z.number(),
  priceChangePercentage24h: z.number(),
  roi: z
    .object({
      currency: z.string(),
      percentage: z.number(),
      times: z.number(),
    })
    .nullable(),
  sparklineIn7d: z.object({
    price: z.array(z.number()),
  }),
  totalSupply: z.number().nullable(),
});

export const coinMarketListSchema = z.array(coinMarketDataSchema);

export const krakenMarketsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    base: z.string(),
    quote: z.string(),
  }),
);

export const coinListSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().nullable(),
    symbol: z.string(),
    platforms: z.array(
      z.object({
        market: z.string(),
        link: z.string(),
      }),
    ),
  }),
);

export const analysisSchema = z.object({
  analysis: z.array(
    z.object({
      symbol: z.string(),
      decision: z.string(),
      confidenceScore: z.number(),
      riskAssessment: z.object({
        liquidityRisk: z.number(),
        volatilityRisk: z.number(),
        drawdownPotential: z.number(),
      }),
      priceTargets: z.object({
        immediateSupport: z.number(),
        nextResistance: z.number(),
        "30dProjection": z.number(),
        stopLoss: z.number(),
        takeProfitLevels: z.array(z.number()),
      }),
      strategicRationale: z.string(),
      timeHorizon: z.string(),
      patternInsights: z.object({
        technicalPattern: z.string(),
        volumeAnomalies: z.string(),
        marketCyclePosition: z.string(),
      }),
      criticalAlert: z.string().nullable(),
      currentPrice: z.number(),
    }),
  ),
  marketOverview: z.object({
    dominanceShift: z.string(),
    sectorRotation: z.string(),
    volatilityForecast: z.string(),
  }),
  fractalAnalysis: z.string(),
});

export type KrakenMarkets = z.infer<typeof krakenMarketsSchema>;
export type CoinMarketData = z.infer<typeof coinMarketDataSchema>;
export type CoinMarketList = z.infer<typeof coinMarketListSchema>;
export type CoinList = z.infer<typeof coinListSchema>;

export type ValidObject = Record<string | number | symbol, unknown>;
