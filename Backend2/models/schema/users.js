const { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum, check } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm'); // Template helper for writing raw SQL

// Role Enum
const roleEnum = pgEnum("role", [
    "ADMIN",
    "MANUFACTURER",
    "TRANSPORTER",
    "WAREHOUSE",
    "STORE",
]);

const users = pgTable(
    "users",
    {
        id_user: uuid("id_user").defaultRandom().primaryKey(),
        fullName: varchar("full_name", { length: 100 }).notNull(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        passwordHash: text("password_hash").notNull(),
        role: roleEnum("role").notNull(),
        walletAddress: varchar("wallet_address", { length: 42 }).unique(),
        companyName: varchar("company_name", { length: 120 }),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true,}).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {withTimezone: true,}).defaultNow().notNull(),
    },
    (table) => [
        check(
            "wallet_address_length_check",
            sql`${table.walletAddress} IS NULL OR length(${table.walletAddress}) = 42`
        ),
    ]
);

module.exports = {users, roleEnum};