const express = require('express');
const registerRouter = express.Router();
const { verifyRoles } = require("../middlewares/verifyRoles")
const authController = require('../controllers/authenticationController');

registerRouter.route("/")
    .post(verifyRoles("ADMIN"), authController.createUser);

module.exports = registerRouter;