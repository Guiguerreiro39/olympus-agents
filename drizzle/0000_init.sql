CREATE TABLE "balance_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"balance" numeric NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kraken_order_id" text NOT NULL,
	"symbol" text NOT NULL,
	"quote_amount" numeric NOT NULL,
	"base_amount" numeric NOT NULL,
	"buy_price" numeric NOT NULL,
	"stop_price" numeric NOT NULL,
	"profit_price" numeric NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_kraken_order_id_unique" UNIQUE("kraken_order_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "kraken_order_id_idx" ON "orders" USING btree ("kraken_order_id");