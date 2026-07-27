const express = require('express');
const manifactureRouter = express.Router();
const manifactureController = require('../../controllers/manifactureController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

manifactureRouter.route('/product/prepare')
    .post(verifyRoles("MANUFACTURER", "ADMIN"), manifactureController.prepareProduct);

manifactureRouter.route('/product/confirm')
    .post(verifyRoles("MANUFACTURER", "ADMIN"), manifactureController.confirmProduct);

manifactureRouter.route('/products/statistics')
    .get(verifyRoles("MANUFACTURER", "ADMIN"), manifactureController.manifacturerStatistics);

manifactureRouter.route('/products')
    .get(verifyRoles("MANUFACTURER", "ADMIN"), manifactureController.manifacturerProducts);

module.exports = manifactureRouter;