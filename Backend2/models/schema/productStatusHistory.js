import { pgTable, uuid, integer, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { products } from "./products.js";
import { productStatuses } from "./productStatuses.js";
import { users } from "./users.js";

export const productStatusHistory = pgTable("product_status_history", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").references(() => products.id_product).notNull(),
    stepTypeId: integer("step_type_id").references(() => productStatuses.id_product_status).notNull(),
    performedBy: uuid("performed_by").references(() => users.id_user).notNull(),
    location: varchar("location", { length: 255, }),
    notes: text("notes"),
    txHash: varchar("tx_hash", { length: 66, }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true, }).defaultNow().notNull(),
},
    (table) => [
        index("product_status_history_product_idx").on(table.productId),
        index("product_status_history_step_idx").on(table.stepTypeId),
        index("product_status_history_performed_by_idx").on(table.performedBy),
        index("product_status_history_created_at_idx").on(table.createdAt),
    ]
);