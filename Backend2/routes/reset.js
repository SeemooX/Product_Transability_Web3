const express = require('express');
const resetRouter = express.Router();
const resetController = require('../controllers/resetController');

resetRouter.route("/request")
    .post(resetController.requestPasswordReset);

resetRouter.route("/confirm")
    .post(resetController.handleReset);

module.exports =  resetRouter;