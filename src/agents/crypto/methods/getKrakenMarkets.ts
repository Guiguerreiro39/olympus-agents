import { mapKrakenMarkets } from "@/server/api/dto/crypto/mapKrakenMarkets";
import { kraken } from "@/agents/crypto/context";
import { UnexpectedError } from "@/lib/dto/error";

export const getKrakenMarkets = async () => {
  try {
    const response = await kraken.loadMarkets();
    const krakenMarkets = mapKrakenMarkets(response);

    return krakenMarkets;
  } catch (error) {
    throw new UnexpectedError("Failed to get Kraken markets", error);
  }
};
