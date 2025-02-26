import { kraken } from "@/agents/crypto/context";
import { balanceHistory } from "@/db/schema";
import { UnexpectedError } from "@/lib/dto/error";
import { db } from "@/db";

export const getKrakenEURBalance = async () => {
  try {
    const balance = await kraken.fetchBalance();
    const result = {
      balance: 0,
    };

    if ("EUR.F" in balance) {
      // Insert balance in the Database
      const currentBalance: typeof balanceHistory.$inferInsert = {
        balance: balance["EUR.F"].free ?? 0,
      };

      result.balance += currentBalance.balance;
    }

    if ("EUR" in balance) {
      // Insert balance in the Database
      const currentBalance: typeof balanceHistory.$inferInsert = {
        balance: balance.EUR.free ?? 0,
      };

      result.balance += currentBalance.balance;
    }

    await db.insert(balanceHistory).values(result);

    return result.balance;
  } catch (error) {
    throw new UnexpectedError("Failed to get Kraken balance", error);
  }
};
