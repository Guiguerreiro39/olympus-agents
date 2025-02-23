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

    // 2. Place Buy Market Order based on EUR amount with Take Profit and Stop Loss
    const krakenOrder = await kraken.createOrderWithTakeProfitAndStopLoss(
      symbol,
      "limit",
      "buy",
      symbolAmount,
      buyPrice,
      profitPrice,
      stopPrice,
    );

    // 3. Store the Order in the Database
    const order: typeof orders.$inferInsert = {
      krakenOrderId: krakenOrder.id,
      symbol,
      quoteAmount: amount,
      baseAmount: symbolAmount,
      buyPrice: buyPrice,
      stopPrice: stopPrice,
      profitPrice: profitPrice,
      status: krakenOrder.status ?? "pending",
    };

    await db.insert(orders).values(order);
  } catch (error) {
    console.error(error);
    throw new UnexpectedError("Failed to set Kraken buy order", error);
  }
};
