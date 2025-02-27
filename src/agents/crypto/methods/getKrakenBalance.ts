import { kraken } from "@/agents/crypto/context";
import { balanceHistory } from "@/db/schema";
import { UnexpectedError } from "@/lib/dto/error";
import { db } from "@/db";

export const getKrakenEURBalance = async () => {
  try {
    const balance = await kraken.fetchBalance();
    let result = 0;

    if ("EUR.F" in balance) {
      result += balance["EUR.F"].free ?? 0;
    }

    if ("EUR" in balance) {
      result += balance.EUR.free ?? 0;
    }

    await db.insert(balanceHistory).values({
      balance: String(result),
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new UnexpectedError("Failed to get Kraken balance", error);
  }
};
