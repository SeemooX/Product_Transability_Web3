CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"reset_token" varchar(255) NOT NULL UNIQUE,
	"expiration_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "password_reset_user_idx" ON "password_reset_tokens" ("user_id");--> statement-breakpoint
CREATE INDEX "password_reset_token_idx" ON "password_reset_tokens" ("reset_token");--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_user_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id_user");