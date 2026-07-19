const db = require("../config/dbConnection");
const { eq } = require("drizzle-orm");
const { products } = require("../models/schema/products");

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

const insertProduct = async (tx, data) => {
    const [product] = await tx
        .insert(products)
        .values(data)
        .returning();

    return product;
};

const getByBlockchainId = async (productID) => {
    const [product] = await db
        .select()
        .from(products)
        .where( eq(products.id_product, productID) )
        .limit(1);

    return product
}

module.exports = { checkProductUniqueness, insertProduct, getByBlockchainId }