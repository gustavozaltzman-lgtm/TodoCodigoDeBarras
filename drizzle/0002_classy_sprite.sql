CREATE TYPE "public"."product_availability" AS ENUM('in_stock', 'out_of_stock', 'preorder', 'discontinued');--> statement-breakpoint
CREATE TYPE "public"."product_condition" AS ENUM('new', 'refurbished', 'used');--> statement-breakpoint
ALTER TYPE "public"."relationship_type" ADD VALUE 'compatible';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "mpn" varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "condition" "product_condition" DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "availability" "product_availability" DEFAULT 'in_stock' NOT NULL;