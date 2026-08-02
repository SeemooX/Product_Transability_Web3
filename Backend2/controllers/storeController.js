const productQueries = require('../Queries/productQueries');

const storeProducts = async (req, res) => {
    try {
        const userId = req.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const search = req.query.search?.trim() || "";
        const sort = req.query.sort || "createdAt_desc";

        const offset = (page - 1) * limit;

        const products = await productQueries.getOthersProducts(
            userId,
            limit,
            offset,
            search,
            sort
        );

        if (products == null) {
            return res.status(500).json({
                error: "Failed to retrieve products.",
            });
        }

        const totalProducts = await productQueries.countOthersProducts(userId, search);

        return res.status(200).json({
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });

    } catch (error) {
        console.error("server error", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const storeStatistics = async (req, res) => {
    try {
        const userId = req.id;

        const warehouseProductStatistics = await productQueries.getStoreStatistics(userId);
        if (warehouseProductStatistics == null) {
            return res.status(500).json({
                error: "Failed to retrieve statistics.",
            });
        }

        return res.status(200).json({
            userStatistics: warehouseProductStatistics
        });
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { storeStatistics, storeProducts }