const express = require('express');
const storeRouter = express.Router();
const storeController = require('../../controllers/storeController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

storeRouter.route('/products/statistics')
    .get(verifyRoles("STORE", "ADMIN"), storeController.storeStatistics);

storeRouter.route('/products')
    .get(verifyRoles("STORE", "ADMIN"), storeController.storeProducts);

module.exports = storeRouter;