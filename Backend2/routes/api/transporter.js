const express = require('express');
const transporterRouter = express.Router();
const transporterController = require('../../controllers/transporterController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

transporterRouter.route('/products/statistics')
    .get(verifyRoles("TRANSPORTER", "ADMIN"), transporterController.transporterStatistics);

transporterRouter.route('/products')
    .get(verifyRoles("TRANSPORTER", "ADMIN"), transporterController.transporterProducts);

module.exports = transporterRouter;