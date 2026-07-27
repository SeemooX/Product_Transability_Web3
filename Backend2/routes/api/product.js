const express = require('express');
const productRouter = express.Router();
const productController = require('../../controllers/productController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

productRouter.route('/:id/trace/prepare')
    .post(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), productController.prepareTraceProduct);

productRouter.route('/:id/trace/confirm')
    .post(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), productController.confirmTraceProduct);

productRouter.route('/:id/history')
    .get(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), productController.productHistory);

productRouter.route('/:id')
    .get(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), productController.productInformation);

module.exports = productRouter;