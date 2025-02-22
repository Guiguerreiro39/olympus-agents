import { kraken } from "@/agents/crypto/context";
import { UnexpectedError } from "@/lib/dto/error";

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
    return await kraken.createOrderWithTakeProfitAndStopLoss(
      symbol,
      "limit",
      "buy",
      symbolAmount,
      buyPrice,
      profitPrice,
      stopPrice,
    );
  } catch (error) {
    console.error(error);
    throw new UnexpectedError("Failed to set Kraken buy order", error);
  }
};
