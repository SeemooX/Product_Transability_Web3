const express = require('express');
const manifactureRouter = express.Router();
const manifactureController = require('../../controllers/manifactureController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

manifactureRouter.route('/product/prepare')
    .post(verifyRoles("MANUFACTURER"), manifactureController.prepareProduct);

manifactureRouter.route('/product/confirm')
    .post(verifyRoles("MANUFACTURER"), manifactureController.confirmProduct);

manifactureRouter.route('/products/statistics')
    .get(verifyRoles("MANUFACTURER"), manifactureController.manifacturerStatistics);

manifactureRouter.route('/products')
    .get(verifyRoles("MANUFACTURER"), manifactureController.manifacturerProducts);

module.exports = manifactureRouter;