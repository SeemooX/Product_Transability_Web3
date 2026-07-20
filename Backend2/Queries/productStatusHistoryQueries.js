const {db} = require("../config/dbConnection");
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

module.exports = { insertProductStatusHistory }