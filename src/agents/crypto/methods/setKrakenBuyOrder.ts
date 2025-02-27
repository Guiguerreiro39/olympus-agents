import { kraken } from "@/agents/crypto/context";
import { UnexpectedError } from "@/lib/dto/error";
import { db } from "@/db";
import { orders } from "@/db/schema";

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
    const buyOrder = await kraken.createMarketBuyOrder(symbol, symbolAmount, {
      stopLossPrice: stopPrice,
    });

    // 3. Check the status of the order and retry if necessary
    let orderStatus = buyOrder;
    const maxRetries = 5;
    let retryCount = 0;

    while (
      retryCount < maxRetries &&
      orderStatus.status !== "closed" &&
      orderStatus.status !== "canceled"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

      try {
        orderStatus = await kraken.fetchOrder(buyOrder.id); // Fetch order status using buyOrder.id
        console.log(
          `Order status check (${retryCount + 1}):`,
          orderStatus.status,
        );
      } catch (fetchError) {
        console.error("Error fetching order status:", fetchError);
        break; // Exit loop on error
      }
      retryCount++;
    }

    if (orderStatus.status !== "closed" && orderStatus.status !== "filled") {
      // Verify Kraken's filled/closed status
      console.error(
        `Main BUY order not filled after ${maxRetries} retries. Status:`,
        orderStatus.status,
      );

      await kraken.cancelOrder(buyOrder.id);
      return;
    }

    // 4. Create the TAKE PROFIT order
    await kraken.createOrder(
      symbol,
      "limit",
      "sell",
      symbolAmount,
      profitPrice,
      {
        ordertype: "take-profit-limit",
        price: profitPrice,
        triggerprice: profitPrice,
      },
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
