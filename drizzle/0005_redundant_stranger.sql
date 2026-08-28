ALTER TABLE "products" ADD COLUMN "sku" varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "cost_price" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "currency" varchar(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");