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
    const buyOrder = await kraken.createOrder(
      symbol,
      "limit",
      "buy",
      amount,
      buyPrice,
    );

    // 3. Create TAKE PROFIT order
    await kraken.createOrder(
      symbol,
      "limit", // Kraken order type for take profit limit
      "sell",
      symbolAmount, // Same amount as the buy order
      profitPrice,
    );

    // 4. Create STOP LOSS order
    await kraken.createOrder(
      symbol,
      "limit", // Kraken order type for stop loss limit
      "sell",
      symbolAmount, // Same amount as the buy order
      stopPrice,
    );

    // 5. Store the Order in the Database
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
