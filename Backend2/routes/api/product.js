const express = require('express');
const productRouter = express.Router();
const productController = require('../../controllers/productController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

productRouter.route('/:id/trace/prepare')
    .post(/* verifyRoles("Manifacturer"),  */productController.prepareTraceProduct);

productRouter.route('/:id/trace/confirm')
    .post(/* verifyRoles("Manifacturer"),  */productController.confirmTraceProduct);

productRouter.route('/:id/history')
    .get(/* verifyRoles("Manifacturer"),  */productController.productHistory);

productRouter.route('/:id')
    .get(/* verifyRoles("Manifacturer"),  */productController.productInformation);

module.exports = productRouter;