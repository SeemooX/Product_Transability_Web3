import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const profileRequestStatusEnum = pgEnum(
    "profile_request_status",
    [
        "PENDING",
        "APPROVED",
        "REJECTED",
    ]
);

const roleEnum = pgEnum("role", [
    "MANUFACTURER",
    "TRANSPORTER",
    "WAREHOUSE",
    "STORE",
]);

export const profileRequests = pgTable("profile_requests", {
    idRequest: uuid("id_request").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: roleEnum("role").notNull(),
    walletAddress: varchar("wallet_address", { length: 42 }),
    companyName: varchar("company_name", { length: 120 }),
    status: profileRequestStatusEnum("status").default("PENDING").notNull(),
    rejectionReason: text("rejection_reason"),
    reviewedBy: uuid("reviewed_by").references(() => users.id_user),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});