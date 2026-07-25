const express = require('express');
const manifactureRouter = express.Router();
const manifactureController = require('../../controllers/manifactureController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

manifactureRouter.route('/product/prepare')
    .post(/* verifyRoles("Manifacturer"),  */manifactureController.prepareProduct);

manifactureRouter.route('/product/confirm')
    .post(/* verifyRoles("Manifacturer"),  */manifactureController.confirmProduct);

manifactureRouter.route('/products/statistics')
    .get(/* verifyRoles("Manifacturer"),  */manifactureController.manifacturerStatistics);

manifactureRouter.route('/products')
    .get(/* verifyRoles("Manifacturer"),  */manifactureController.manifacturerProducts);

module.exports = manifactureRouter;