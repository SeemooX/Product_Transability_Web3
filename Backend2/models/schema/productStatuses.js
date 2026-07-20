const { pgTable, serial, varchar, text } = require("drizzle-orm/pg-core");

const productStatuses = pgTable("product_statuses", {
  id_product_status: serial("id_product_status").primaryKey(),
  code: varchar("code", { length: 50, }).notNull().unique(),
  label: varchar("label", { length: 100, }).notNull(),
  description: text("description"),
});

module.exports = {productStatuses};

// Later to seed the database with the
/* 
[
  {
    code: "CREATED",
    label: "Created",
  },
  {
    code: "PICKED_UP",
    label: "Picked Up",
  },
  {
    code: "DELIVERED_TO_WAREHOUSE",
    label: "Delivered To Warehouse",
  },
  {
    code: "RECEIVED_AT_WAREHOUSE",
    label: "Received At Warehouse",
  },
  {
    code: "READY_FOR_DISPATCH",
    label: "Ready For Dispatch",
  },
  {
    code: "PICKED_UP_FROM_WAREHOUSE",
    label: "Picked Up From Warehouse",
  },
  {
    code: "DELIVERED_TO_STORE",
    label: "Delivered To Store",
  },
  {
    code: "AVAILABLE_FOR_SALE",
    label: "Available For Sale",
  },
]
*/