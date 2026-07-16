const express = require('express');
const registerRouter = express.Router();
const verifyRole = require("../middlewares/verifyRoles")
const authController = require('../controllers/authenticationController');

authRouter("/")
    .post(verifyRole("Admin"), authController.createUser);

module.exports = registerRouter;