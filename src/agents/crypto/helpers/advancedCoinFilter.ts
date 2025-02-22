import type { CoinMarketData } from "@/agents/crypto/types";

export function advancedCoinFilter(coins: CoinMarketData[]): CoinMarketData[] {
  if (!coins || coins.length === 0) {
    return [];
  }

  const calculateBullishScore = (coin: CoinMarketData): number => {
    let bullishScore = 0;

    // ** 1. Momentum Indicators (Weight: 40%) **
    // Short-term price momentum is crucial for bullishness.
    bullishScore += (coin.priceChangePercentage24h || 0) * 0.2; // Recent 24h price surge
    bullishScore += (coin.priceChangePercentage1hInCurrency || 0) * 0.1; // Very recent 1h momentum

    const sparkline = coin.sparklineIn7d.price;
    if (sparkline && sparkline.length > 7) {
      const recentSparklineTrend =
        (sparkline[sparkline.length - 1] ?? 0) -
        (sparkline[sparkline.length - 7] ?? 0);

      bullishScore +=
        Math.sign(recentSparklineTrend) *
        Math.min((Math.abs(recentSparklineTrend) / coin.currentPrice) * 10, 5) *
        0.1; // 7d trend, capped and sign considered
    }

    // ** 2. Relative Strength & Reversal Signals (Weight: 30%) **
    // How strong is the coin compared to its recent range and ATH?
    const dayRange = coin.high24h - coin.low24h;
    const proximityToHigh =
      dayRange === 0 ? 0 : (coin.currentPrice - coin.low24h) / dayRange;
    bullishScore += proximityToHigh * 0.15; // Closer to 24h high is bullish

    const athChangePercentage = coin.allTimeHighChangePercentage ?? -100; // Default to -100 if null
    if (athChangePercentage < -50) {
      bullishScore -= 0.05 * Math.abs(Math.min(0, athChangePercentage + 50)); // Penalize heavily if far from ATH, but less penalty as we get closer to -50%
    } else if (athChangePercentage < 0) {
      bullishScore += 0.05 * Math.max(0, 0 - athChangePercentage); // Reward being closer to ATH in negative territory
    } else {
      bullishScore += 0.1; // Positive bonus for being above ATH (new ATH signal)
    }

    // ** 3. Market Depth & Interest (Weight: 20%) **
    // Deeper markets can sustain bullish runs.
    bullishScore += Math.max(0, 1 - coin.marketCapRank / 100) * 0.1; // Bonus for higher market cap rank (Top 100 focus) - Non-linear scaling
    bullishScore +=
      Math.min(0.1, (coin.marketCapChangePercentage24h || 0) / 50) * 0.1; // Positive market cap change indicates broader interest, capped at 10% boost.

    // ** 4. Supply Dynamics & Potential Scarcity (Weight: 10%) **
    // Scarcity can drive bullish narratives. (Basic level with given data)
    const supplyRatio =
      coin.circulatingSupply && coin.totalSupply
        ? coin.circulatingSupply / coin.totalSupply
        : 0.5; // Default to 0.5 if supply data missing
    bullishScore += (1 - supplyRatio) * 0.1; // Lower supply ratio (more scarcity potential) is slightly bullish

    return bullishScore;
  };

  return [...coins].sort(
    (a, b) => calculateBullishScore(b) - calculateBullishScore(a),
  );
}
