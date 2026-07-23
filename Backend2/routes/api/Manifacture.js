const express = require('express');
const manifactureRouter = express.Router();
const manifactureController = require('../../controllers/manifactureController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

manifactureRouter.route('/product/prepare')
    .post(verifyRoles("Manifacturer"), manifactureController.prepareProduct);

manifactureRouter.route('/product/confirm')
    .post(verifyRoles("Manifacturer"), manifactureController.confirmProduct);

module.exports = manifactureRouter;