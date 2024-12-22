const { Router } = require('express');
const messagesController = require("../controllers/messages.controller");

const messagesRouter = Router();

messagesRouter.get('/', messagesController.getMessages);
messagesRouter.post('/', messagesController.postMessage);

module.exports = messagesRouter;