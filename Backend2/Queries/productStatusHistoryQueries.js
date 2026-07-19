const db = require("../config/dbConnection");
const { productStatusHistory } = require("../models/schema/productStatusHistory");

const insertProductStatusHistory = async (tx, data) => {
    await tx
        .insert(productStatusHistory)
        .values(data);
};

module.exports = { insertProductStatusHistory }