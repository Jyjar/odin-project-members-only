const { Router } = require("express");
const indexRouter = Router();
const membersController = require("../controllers/membersController");

indexRouter.get("/", membersController.getMessages);

module.exports = indexRouter;