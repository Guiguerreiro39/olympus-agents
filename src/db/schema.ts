import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    krakenOrderId: text("kraken_order_id").unique().notNull(),

    symbol: text("symbol").notNull(),

    quoteAmount: integer("quote_amount").notNull(),
    baseAmount: integer("base_amount").notNull(),
    buyPrice: integer("buy_price").notNull(),
    stopPrice: integer("stop_price").notNull(),
    profitPrice: integer("profit_price").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("kraken_order_id_idx").on(t.krakenOrderId)],
);

export const balanceHistory = pgTable("balance_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  balance: integer("balance").notNull(),

  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
