const express = require('express');
const manifactureRouter = express.Router();
const manifactureController = require('../../controllers/manifactureController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

manifactureRouter.route('/product/prepare')
    .post(verifyRoles("Admin"), manifactureController.prepareProduct);

manifactureRouter.route('/product/confirm')
    .post(verifyRoles("Admin"), manifactureController.confirmProduct);