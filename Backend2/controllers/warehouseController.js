const productQueries = require('../Queries/productQueries');

const warehouseProducts = async (req, res) => {
    try {
        const userId = req.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const offset = (page - 1) * limit;

        const products = await productQueries.getOthersProducts(userId, limit, offset);
        if (products == null) {
            return res.status(500).json({
                error: "Failed to retrieve products.",
            });
        }
        const totalProducts = await productQueries.countProducts(userId);

        return res.status(200).json({
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit)
            }
        });
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const warehouseStatistics = async (req, res) => {
    try {
        const userId = req.id;

        const warehouseProductStatistics = await productQueries.getWarehouseStatistics(userId);
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

module.exports = { warehouseStatistics, warehouseProducts }