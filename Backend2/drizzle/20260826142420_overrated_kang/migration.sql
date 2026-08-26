CREATE TYPE "profile_request_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "profile_requests" (
	"id_request" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"wallet_address" varchar(42),
	"image_url" text,
	"company_name" varchar(120),
	"status" "profile_request_status" DEFAULT 'PENDING'::"profile_request_status" NOT NULL,
	"rejection_reason" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_requests" ADD CONSTRAINT "profile_requests_reviewed_by_users_id_user_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id_user");