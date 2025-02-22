import { env } from "@/env";
import ccxt from "ccxt";

export const kraken = new ccxt.kraken({
  apiKey: env.KRAKEN_API_KEY,
  secret: env.KRAKEN_PRIVATE_KEY,
});
