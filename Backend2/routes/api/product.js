const express = require('express');
const productRouter = express.Router();
const productController = require('../../controllers/productController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

productRouter.route('/:id/trace/prepare')
    .post(/* verifyRoles("Manifacturer"),  */productController.prepareTraceProduct);

productRouter.route('/:id/trace/confirm')
    .post(/* verifyRoles("Manifacturer"),  */productController.confirmTraceProduct);

module.exports = productRouter;