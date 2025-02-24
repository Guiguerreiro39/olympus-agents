import { kraken } from "@/agents/crypto/context";
import { UnexpectedError } from "@/lib/dto/error";
import { db } from "@/db";
import { orders } from "@/db/schema";

type Props = {
  symbol: string;
  amount: number; // in Euro
  buyPrice: number;
  stopPrice: number;
  profitPrice: number;
};

export const setKrakenBuyOrder = async ({
  symbol,
  amount,
  buyPrice,
  stopPrice,
  profitPrice,
}: Props) => {
  try {
    // 1. Calculate the Symbol Amount to Buy with EUR
    const symbolAmount = +(amount / buyPrice).toFixed(4);

    // 2. Create the initial BUY order
    const params = {
      stopLoss: {
        triggerPrice: stopPrice,
        type: "market",
      },
      takeProfit: {
        triggerPrice: profitPrice,
        type: "market",
      },
    };
    const buyOrder = await kraken.createOrder(
      symbol,
      "limit",
      "buy",
      amount,
      buyPrice,
      params,
    );

    // 3. Store the Order in the Database
    const order: typeof orders.$inferInsert = {
      krakenOrderId: buyOrder.id,
      symbol,
      quoteAmount: amount,
      baseAmount: symbolAmount,
      buyPrice: buyPrice,
      stopPrice: stopPrice,
      profitPrice: profitPrice,
      status: buyOrder.status ?? "pending",
    };

    await db.insert(orders).values(order);
  } catch (error) {
    console.error(error);
    throw new UnexpectedError("Failed to set Kraken buy order", error);
  }
};
