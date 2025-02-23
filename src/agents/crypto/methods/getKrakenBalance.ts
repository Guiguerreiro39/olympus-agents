import { kraken } from "@/agents/crypto/context";
import { balanceHistory } from "@/db/schema";
import { UnexpectedError } from "@/lib/dto/error";
import { db } from "@/db";

export const getKrakenEURBalance = async () => {
  try {
    const balance = await kraken.fetchBalance();

    if ("EUR" in balance) {
      // Insert balance in the Database
      const currentBalance: typeof balanceHistory.$inferInsert = {
        balance: balance.EUR.free ?? 0,
      };

      await db.insert(balanceHistory).values(currentBalance);

      return balance.EUR.free;
    }

    return 0;
  } catch (error) {
    throw new UnexpectedError("Failed to get Kraken balance", error);
  }
};
