const express = require('express');
const adminRouter = express.Router();
const { verifyRoles } = require("../middlewares/verifyRoles")
const adminController = require('../controllers/adminController');

adminRouter.route("/")
    .post(verifyRoles("ADMIN"), adminController);

module.exports = adminRouter;