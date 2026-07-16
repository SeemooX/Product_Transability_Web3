const express = require('express');
const resetRouter = express.Router();
const authController = require('../controllers/authenticationController');

resetRouter.route("/request")
    .post(authController.handleResetRequest);

resetRouter.route("/confirm")
    .post(authController.handleReset);

module.exports = resetRouter;