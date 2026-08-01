const express = require('express');
const express = require('express');
const usersRouter = express.Router();
const usersController = require('../../controllers/usersController');

usersRouter.route('/:id')
    .get(usersController.getUser)
    .patch(usersController.updateUserInfos);

module.exports = usersRouter;