const { db } = require('../config/dbConnection.js');
const { productStatuses } = require('./schema/productStatuses.js');

const statuses = [
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
];

async function seed() {
    await db.insert(productStatuses).values(statuses);

    console.log("Product statuses seeded successfully");
    process.exit(0);
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});