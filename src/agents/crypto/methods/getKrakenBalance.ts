import { kraken } from "@/agents/crypto/context";
import { UnexpectedError } from "@/lib/dto/error";

export const getKrakenEURBalance = async () => {
  try {
    const balance = await kraken.fetchBalance();

    if ("EUR" in balance) {
      return balance.EUR.free;
    }

    return 0;
  } catch (error) {
    throw new UnexpectedError("Failed to get Kraken balance", error);
  }
};
