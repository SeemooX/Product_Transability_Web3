const express = require('express');
const adminRouter = express.Router();
const { verifyRoles } = require("../../middlewares/verifyRoles")
const adminController = require('../../controllers/adminController');

adminRouter.route("/accept/:id")
    .post(verifyRoles("ADMIN"), adminController.acceptUser);

adminRouter.route("/reject/:id")
    .post(verifyRoles("ADMIN"), adminController.rejectUser);

module.exports = adminRouter;