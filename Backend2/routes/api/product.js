const express = require('express');
const productRouter = express.Router();
const productController = require('../../controllers/productController');
const { verifyRoles } = require('../../middlewares/verifyRoles');
const upload = require('../../middlewares/multer');

productRouter.route('/:id/trace/prepare')
    .post(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), productController.prepareTraceProduct);

productRouter.route('/:id/trace/confirm')
    .post(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), upload.single("photo"), productController.confirmTraceProduct);

productRouter.route('/:id/history')
    .get(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), productController.productHistory);

productRouter.route('/:id')
    .get(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), productController.productInformation);

module.exports = productRouter;