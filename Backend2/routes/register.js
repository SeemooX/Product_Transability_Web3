const express = require('express');
const registerRouter = express.Router();
const verifyRole = require("../middlewares/verifyRoles")
const authController = require('../controllers/authenticationController');

registerRouter.route("/")
    .post(verifyRole("ADMIN"), authController.createUser);

module.exports = registerRouter;