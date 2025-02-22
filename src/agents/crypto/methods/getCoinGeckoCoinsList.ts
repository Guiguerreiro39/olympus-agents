import axios from "axios";
import { env } from "@/env";
import { mapCoinList } from "@/server/api/dto/mapCoinList";
import { UnexpectedError } from "@/lib/dto/error";

export const getCoinGeckoCoinsList = async () => {
  try {
    const response = await axios.get(
      `${env.NEXT_PUBLIC_COINGECKO_API_URL}/coins/list?include_platform=true`,
    );
    const coinList = mapCoinList(response.data);

    return coinList;
  } catch (error) {
    console.error(error);
    throw new UnexpectedError("Failed to get CoinGecko coins list", error);
  }
};
