const { db } = require("../config/dbConnection");
const { eq, or, sql, count, countDistinct, and, ilike, asc, desc, } = require("drizzle-orm");
const { products } = require("../models/schema/products");
const { productStatuses } = require("../models/schema/productStatuses");
const { productStatusHistory } = require("../models/schema/productStatusHistory");

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

const getProducts = async (userId, limit, offset, search, sort) => {
    const conditions = [
        eq(products.manufacturerId, userId),
    ];

    if (search) {
        conditions.push(
            ilike(products.name, `%${search}%`)
        );
    }

    let orderBy;

    if (sort === "createdAt_asc") {
        orderBy = asc(products.createdAt);
    } else {
        orderBy = desc(products.createdAt);
    }

    return await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);
};

const getOthersProducts = async (userId, limit, offset, search, sort) => {
    const conditions = [
        eq(productStatusHistory.performedBy, userId)
    ];

    if (search) {
        conditions.push(
            ilike(products.name, `%${search}%`)
        );
    }

    let orderBy;

    switch (sort) {
        case "createdAt_asc":
            orderBy = asc(products.createdAt);
            break;

        case "name_asc":
            orderBy = asc(products.name);
            break;

        case "name_desc":
            orderBy = desc(products.name);
            break;

        default:
            orderBy = desc(products.createdAt);
    }


    return await db
        .selectDistinct({
            id_product: products.id_product,
            manufacturerId: products.manufacturerId,
            name: products.name,
            reference: products.reference,
            serialNumber: products.serialNumber,
            description: products.description,
            currentStatus: products.currentStatus,
            qrCode: products.qrCode,
            metadataHash: products.metadataHash,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
        })
        .from(products)
        .innerJoin(
            productStatusHistory,
            eq(
                productStatusHistory.productId,
                products.id_product
            )
        )
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);
};

const countProducts = async (userId, search) => {
    const conditions = [
        eq(products.manufacturerId, userId),
    ]

    if (search) {
        conditions.push(
            ilike(products.name, `%${search}%`)
        )
    }

    const result = await db
        .select({
            total: count(),
        })
        .from(products)
        .where(and(...conditions));

    return result[0].total;
};

const countOthersProducts = async (userId, search) => {
    const conditions = [
        eq(productStatusHistory.performedBy, userId)
    ];

    if (search) {
        conditions.push(
            ilike(products.name, `%${search}%`)
        );
    }

    const result = await db
        .select({
            total: countDistinct(products.id_product),
        })
        .from(products)
        .innerJoin(
            productStatusHistory,
            eq(
                productStatusHistory.productId,
                products.id_product
            )
        )
        .where(and(...conditions));

    return result[0].total;
};

const getManufacturerStatistics = async (userId) => {
    const [stats] = await db
        .select({
            total: sql`count(*)`,
            shipping: sql`
                count(*) filter (
                    where ${products.currentStatus} in (
                        'PICKED_UP',
                        'PICKED_UP_FROM_WAREHOUSE'
                    )
                )
            `,
            shipped: sql`
                count(*) filter (
                    where ${products.currentStatus} in (
                        'DELIVERED_TO_STORE',
                        'AVAILABLE_FOR_SALE'
                    )
                )
            `,
            waiting: sql`
                count(*) filter (
                    where ${products.currentStatus} in (
                        'DELIVERED_TO_WAREHOUSE',
                        'RECEIVED_AT_WAREHOUSE',
                        'READY_FOR_DISPATCH'
                    )
                )
            `,
        })
        .from(products)
        .where(eq(products.manufacturerId, userId));

    return stats;
};

const getTransporterStatistics = async (userId) => {
    const [available] = await db
        .select({
            count: sql`
            count(*) filter (
                where ${products.currentStatus} in (
                    'CREATED',
                    'READY_FOR_DISPATCH'
                )
            )
        `,
        })
        .from(products);

    const [activity] = await db
        .select({
            picked: sql`
            count(distinct ${productStatusHistory.productId}) filter (
                where ${productStatuses.code} in (
                    'PICKED_UP',
                    'PICKED_UP_FROM_WAREHOUSE'
                )
            )
        `,
            delivered: sql`
            count(distinct ${productStatusHistory.productId}) filter (
                where ${productStatuses.code} in (
                    'DELIVERED_TO_WAREHOUSE',
                    'DELIVERED_TO_STORE'
                )
            )
        `,
        })
        .from(productStatusHistory)
        .innerJoin(
            productStatuses,
            eq(productStatusHistory.stepTypeId, productStatuses.id_product_status)
        )
        .where(eq(productStatusHistory.performedBy, userId));

    return {
        available: available.count,
        picked: activity.picked,
        delivered: activity.delivered,
    };
}

const getWarehouseStatistics = async (userId) => {
    const [stats] = await db
        .select({
            received: sql`
                count(*)
                filter (
                    where ${productStatusHistory.code} in (
                    'RECEIVED_AT_WAREHOUSE',
                    )
                )
                `,
            ready: `
                count(*)
                filter (
                    where ${productStatusHistory.code} in (
                    'READY_FOR_DISPATCH',
                    )
                )
                `,
        })
        .from(productStatusHistory)
        .innerJoin(
            productStatuses,
            eq(productStatusHistory.stepTypeId, productStatuses.id_product_status)
        )
        .where(eq(productStatusHistory.performedBy, userId));

    return stats;
}

const getStoreStatistics = async (userId) => {
    const [stats] = await db
        .select({
            available: sql`
                count(*)
                filter (
                    where ${productStatusHistory.code} in (
                    'AVAILABLE_FOR_SALE',
                    )
                )
                `
        })
        .from(productStatusHistory)
        .innerJoin(
            productStatuses,
            eq(productStatusHistory.stepTypeId, productStatuses.id_product_status)
        )
        .where(eq(productStatusHistory.performedBy, userId));

    return stats;
}

const getProductHistory = async (productId) => {
    const history = await db
        .select({
            id: productStatusHistory.id,
            productId: productStatusHistory.productId,
            stepTypeId: productStatusHistory.stepTypeId,
            code: productStatuses.code,
            label: productStatuses.label,
            performedBy: productStatusHistory.performedBy,
            location: productStatusHistory.location,
            notes: productStatusHistory.notes,
            txHash: productStatusHistory.txHash,
            createdAt: productStatusHistory.createdAt,
        })
        .from(productStatusHistory)
        .innerJoin(
            productStatuses,
            eq(productStatusHistory.stepTypeId, productStatuses.id_product_status)
        )
        .where(eq(productStatusHistory.productId, productId));

    return history;
}

const getProductInformation = async (productId) => {
    const infos = await db
        .select()
        .from(products)
        .where(
            eq(products.id_product, productId)
        );

    return infos;
}

module.exports = { checkProductUniqueness, insertProduct, getByBlockchainId, retrieveProduct, updateProduct, retrieveStepType, getProducts, getManufacturerStatistics, getProductHistory, getProductInformation, countProducts, getTransporterStatistics, getOthersProducts, getWarehouseStatistics, getStoreStatistics, countOthersProducts }