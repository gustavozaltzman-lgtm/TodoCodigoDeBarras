ALTER TABLE "inquiries" ADD COLUMN "ip_address" varchar(64);--> statement-breakpoint
CREATE INDEX "inquiries_ip_created_idx" ON "inquiries" USING btree ("ip_address","created_at");