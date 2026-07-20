const {db} = require("../config/dbConnection");
const { eq } = require("drizzle-orm");
const { productStatusHistory } = require("../models/schema/productStatusHistory");

const insertProductStatusHistory = async (client, data) => {
    await client.query(
        `
        INSERT INTO product_status_history (
            product_id,
            step_type_id,
            performed_by,
            location,
            tx_hash
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
            data.productId,
            data.stepTypeId,
            data.performedBy,
            data.location,
            data.txHash
        ]
    );
};

const insertProductStatusHistoryWithNotes = async (client, data) => {
    await client.query(
        `
        INSERT INTO product_status_history (
            product_id,
            step_type_id,
            performed_by,
            location,
            notes,
            tx_hash
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
            data.productId,
            data.stepTypeId,
            data.performedBy,
            data.location,
            data.notes,
            data.txHash
        ]
    );
};

const getStatusCode = async (stepType) => {
    const [status] = await db
        .select()
        .from(productStatuses)
        .where(eq(productStatuses.id_product_status, stepType))
        .limit(1);

    return status;
};

module.exports = { insertProductStatusHistory , insertProductStatusHistoryWithNotes, getStatusCode}