CREATE TYPE "role" AS ENUM('ADMIN', 'MANUFACTURER', 'TRANSPORTER', 'WAREHOUSE', 'STORE');--> statement-breakpoint
CREATE TABLE "products" (
	"id_product" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"manufacturer_id" uuid NOT NULL,
	"name" varchar(150) NOT NULL,
	"reference" varchar(80) UNIQUE,
	"serial_number" varchar(120) UNIQUE,
	"description" text,
	"current_status" varchar(40) NOT NULL,
	"qr_code" text UNIQUE,
	"blockchain_product_id" bigint,
	"metadata_hash" varchar(66),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_statuses" (
	"id_product_status" serial PRIMARY KEY,
	"code" varchar(50) NOT NULL UNIQUE,
	"label" varchar(100) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "product_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"step_type_id" integer NOT NULL,
	"performed_by" uuid NOT NULL,
	"location" varchar(255),
	"notes" text,
	"tx_hash" varchar(66) UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id_user" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"role" "role" NOT NULL,
	"wallet_address" varchar(42) UNIQUE,
	"company_name" varchar(120),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_address_length_check" CHECK ("wallet_address" IS NULL OR length("wallet_address") = 42)
);
--> statement-breakpoint
CREATE INDEX "reference_index" ON "products" ("reference");--> statement-breakpoint
CREATE INDEX "serial_number_index" ON "products" ("serial_number");--> statement-breakpoint
CREATE INDEX "current_status_index" ON "products" ("current_status");--> statement-breakpoint
CREATE INDEX "manufacturer_id_index" ON "products" ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "product_status_history_product_idx" ON "product_status_history" ("product_id");--> statement-breakpoint
CREATE INDEX "product_status_history_step_idx" ON "product_status_history" ("step_type_id");--> statement-breakpoint
CREATE INDEX "product_status_history_performed_by_idx" ON "product_status_history" ("performed_by");--> statement-breakpoint
CREATE INDEX "product_status_history_created_at_idx" ON "product_status_history" ("created_at");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_users_id_user_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "users"("id_user");--> statement-breakpoint
ALTER TABLE "product_status_history" ADD CONSTRAINT "product_status_history_product_id_products_id_product_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id_product");--> statement-breakpoint
ALTER TABLE "product_status_history" ADD CONSTRAINT "product_status_history_9erfCQHpEPBT_fkey" FOREIGN KEY ("step_type_id") REFERENCES "product_statuses"("id_product_status");--> statement-breakpoint
ALTER TABLE "product_status_history" ADD CONSTRAINT "product_status_history_performed_by_users_id_user_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id_user");