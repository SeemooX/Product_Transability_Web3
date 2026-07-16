import { pgTable, uuid, varchar, text, bigint, timestamp, index,} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const products = pgTable(
    "products",
    {
        id_product: uuid("id_product").defaultRandom().primaryKey(),
        manufacturerId: uuid("manufacturer_id").references(() => users.id_user).notNull(),
        name: varchar("name", { length: 150 }).notNull(),
        reference: varchar("reference", { length: 80 }).unique(),
        serialNumber: varchar("serial_number", { length: 120 }).unique(),
        description: text("description"),
        currentStatus: varchar("current_status", { length: 40, }).notNull(),
        qrCode: text("qr_code").unique(),
        blockchainProductId: bigint("blockchain_product_id", { mode: "number", }),
        metadataHash: varchar("metadata_hash", { length: 66, }),
        createdAt: timestamp("created_at", { withTimezone: true, }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, }).defaultNow().notNull(),
    },
    (table) => [
        index("reference_index").on(table.reference),
        index("serial_number_index").on(table.serialNumber),
        index("current_status_index").on(table.currentStatus),
        index("manufacturer_id_index").on(table.manufacturerId),
    ]
);