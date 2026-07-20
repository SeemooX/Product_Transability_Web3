const express = require('express');
const loginRouter = express.Router();
const authController = require('../controllers/authenticationController');

loginRouter.route("/")
    .post(authController.handleLogin);

module.exports = loginRouter;