DROP TABLE "meet" CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "latency_ms" integer;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "token_in" integer;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "token_out" integer;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "model" varchar;--> statement-breakpoint
ALTER TABLE "charts" DROP COLUMN "name";