const friendsController = require("../controllers/friends.controller");
const express = require("express");

const friendsRouter = express.Router();

friendsRouter.get('/', friendsController.getFriends);
friendsRouter.post('/', friendsController.postFriend)


module.exports = friendsRouter;