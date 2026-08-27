const express = require('express');
const usersRouter = express.Router();
const usersController = require('../../controllers/usersController');
const { verifyRoles } = require('../../middlewares/verifyRoles');

usersRouter.route('/me')
    .get(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), usersController.getUser)
    .patch(verifyRoles("MANUFACTURER", "TRANSPORTER", "WAREHOUSE", "STORE"), usersController.updateUserInfos);

module.exports = usersRouter;