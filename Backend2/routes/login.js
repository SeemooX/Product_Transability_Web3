const express = require('express');
const loginRouter = express.Router();
const authController = require('../controllers/authenticationController');

authRouter("/")
    .post(authController.handleLogin);

module.exports = loginRouter;