import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const passwordResetTokens = pgTable("password_reset_tokens", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id_user).notNull(),
    resetToken: varchar("reset_token", { length: 255, }).notNull().unique(),
    expirationDate: timestamp("expiration_date", { withTimezone: true, }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, }).defaultNow().notNull(),
},
    (table) => [
        index("password_reset_user_idx").on(table.userId),
        index("password_reset_token_idx").on(table.resetToken),
    ]
);