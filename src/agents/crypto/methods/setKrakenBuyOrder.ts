import { kraken } from "@/agents/crypto/context";
import { UnexpectedError } from "@/lib/dto/error";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { sleep } from "@trpc/server/unstable-core-do-not-import";

const RETRY_LIMIT = 5;

type Props = {
  symbol: string;
  amount: number; // in Euro
  stopPrice: number;
  profitPrice: number;
};

export const setKrakenBuyOrder = async ({
  symbol,
  amount,
  stopPrice,
  profitPrice,
}: Props) => {
  try {
    // 0. Fetch the Ticker
    const ticker = await kraken.fetchTicker(symbol);

    if (!ticker.ask) throw new Error("Failed to fetch ticker");

    // 1. Calculate the Symbol Amount to Buy with EUR
    const symbolAmount = +(amount / ticker.ask).toFixed(4);

    // 2. Create the initial BUY order
    let buyOrder = await kraken.createOrder(
      symbol,
      "market",
      "buy",
      symbolAmount,
    );

    for (let i = 0; i < RETRY_LIMIT; i++) {
      buyOrder = await kraken.fetchOrder(buyOrder.id);
      if (buyOrder.status === "closed") break;

      await sleep(3000);
    }

    if (buyOrder.status !== "closed") {
      await kraken.cancelOrder(buyOrder.id);
      return;
    }

    // 3. Create stop loss order
    await kraken.createStopOrder(
      symbol,
      "limit",
      "sell",
      symbolAmount,
      stopPrice,
      stopPrice,
    );

    // 4. Create take profit order
    await kraken.createTakeProfitOrder(
      symbol,
      "limit",
      "sell",
      symbolAmount,
      profitPrice,
      profitPrice,
    );

    // 5. Store the Order in the Database
    const order: typeof orders.$inferInsert = {
      krakenOrderId: buyOrder.id,
      symbol,
      quoteAmount: amount,
      baseAmount: symbolAmount,
      buyPrice: ticker.ask,
      stopPrice: stopPrice,
      profitPrice: profitPrice,
    };

    await db.insert(orders).values(order);
  } catch (error) {
    console.error(error);
    throw new UnexpectedError("Failed to set Kraken buy order", error);
  }
};
