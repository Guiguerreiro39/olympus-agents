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
    // 0. Fetch the Ticker
    const ticker = await kraken.fetchTicker(symbol);

    // 1. Calculate the Symbol Amount to Buy with EUR
    const symbolAmount = +(amount / buyPrice).toFixed(4);

    // 2. Create the initial BUY order
    const params = {
      takeProfitPrice: profitPrice,
      stopLossPrice: stopPrice,
    };

    const bestBuyPrice =
      ticker.ask && ticker.ask < buyPrice ? ticker.ask : buyPrice;

    const buyOrder = await kraken.createOrder(
      symbol,
      "limit",
      "buy",
      symbolAmount,
      bestBuyPrice,
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
