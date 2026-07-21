const { db } = require("../config/dbConnection");
const { eq, or } = require("drizzle-orm");
const { products } = require("../models/schema/products");
const { productStatuses  } = require("../models/schema/productStatuses");

const retrieveProduct = async (productID) => {
    const [product] = await db
        .select()
        .from(products)
        .where(
            eq(products.id_product, productID)
        )
        .limit(1);

    return product;
}

const retrieveStepType = async (productID) => {
    const result = await db
        .select({
            idProductStatus: productStatuses.id_product_status,
        })
        .from(products)
        .innerJoin(
            productStatuses,
            eq(products.currentStatus, productStatuses.code)
        )
        .where(eq(products.id_product, productID));

    return result[0]?.idProductStatus ?? null;
}

const updateProduct = async (client, data) => {
    const result = await client.query(
        `
        UPDATE products
        SET
            current_status = $1
        WHERE id_product = $2
        RETURNING *;
        `,
        [
            data.statuscode,
            data.productID,
        ]
    );

    return result.rows[0];
}

const checkProductUniqueness = async (reference, serialNumber) => {
    const [product] = await db
        .select()
        .from(products)
        .where(
            or(
                eq(products.reference, reference),
                eq(products.serialNumber, serialNumber)
            )
        )
        .limit(1);

    return product;
};

const insertProduct = async (client, data) => {
    const result = await client.query(
        `
        INSERT INTO products (
            id_product,
            manufacturer_id,
            name,
            reference,
            serial_number,
            description,
            current_status,
            qr_code,
            metadata_hash
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
            data.id_product,
            data.manufacturerId,
            data.name,
            data.reference,
            data.serialNumber,
            data.description,
            data.currentStatus,
            JSON.stringify(data.qrCode),
            data.metadataHash
        ]
    );

    return result.rows[0];
};

const getByBlockchainId = async (productID) => {
    const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id_product, productID))
        .limit(1);

    return product
}

module.exports = { checkProductUniqueness, insertProduct, getByBlockchainId, retrieveProduct, updateProduct, retrieveStepType }