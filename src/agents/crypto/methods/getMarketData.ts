import type {
  CoinList,
  CoinMarketData,
  KrakenMarkets,
} from "@/agents/crypto/types";
import axios, { AxiosError } from "axios";
import { mapCoinMarketList } from "../../../server/api/dto/mapCoinMarketList";
import { sleep } from "@trpc/server/unstable-core-do-not-import";
import { env } from "@/env";
import { UnexpectedError } from "@/lib/dto/error";

type Props = {
  krakenMarkets: KrakenMarkets;
  coinList: CoinList;
};

export const getMarketData = async ({ krakenMarkets, coinList }: Props) => {
  const coinIdsToSymbol = coinList.reduce(
    (acc, coin) => {
      const krakenCoin = krakenMarkets
        .filter((c) => c.quote === "EUR")
        .find(
          (c) =>
            (c.base.toLowerCase() === coin.symbol?.toLowerCase() &&
              coin.platforms.length === 0) ||
            c.base.toLowerCase() === coin.id?.toLowerCase(),
        );

      if (krakenCoin) acc[coin.id] = krakenCoin.symbol;
      return acc;
    },
    {} as Record<string, string>,
  );

  const krakenCoinIds = Object.keys(coinIdsToSymbol);

  let splicedArray = krakenCoinIds.splice(0, 250);
  let fullResult: CoinMarketData[] = [];

  while (splicedArray.length) {
    try {
      const response = await axios.get(
        `${env.NEXT_PUBLIC_COINGECKO_API_URL}/coins/markets?vs_currency=eur&order=volume_desc&per_page=250&sparkline=true&price_change_percentage=1h&ids=${splicedArray.join(",")}`,
      );

      const result = mapCoinMarketList(response.data).map((data) => ({
        ...data,
        symbol: coinIdsToSymbol[data.id] ?? data.symbol,
      }));

      fullResult = [...fullResult, ...result];
      splicedArray = krakenCoinIds.splice(0, 250);
    } catch (error) {
      if (error instanceof AxiosError && error.status === 429) {
        await sleep(5000);
        continue;
      }

      throw new UnexpectedError("Failed to get market data", error);
    }
  }

  return fullResult;
};
