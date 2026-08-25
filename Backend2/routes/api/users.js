const express = require('express');
const usersRouter = express.Router();
const usersController = require('../../controllers/usersController');

usersRouter.route('/me')
    .get(usersController.getUser)
    .patch(usersController.updateUserInfos);

module.exports = usersRouter;