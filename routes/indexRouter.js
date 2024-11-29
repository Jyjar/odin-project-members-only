const { Router } = require("express");
const indexRouter = Router();
const membersController = require("../controllers/membersController");

indexRouter.get("/", membersController.getMessages);
indexRouter.get("/log-in", membersController.logInGet);
indexRouter.post("/log-in", membersController.logInPost);
indexRouter.get("/log-out", membersController.logOutGet);
indexRouter.get("/sign-up", membersController.signUpGet);
indexRouter.post("/sign-up", membersController.signUpPost);
indexRouter.get("/create-message", membersController.createMessageGet)
indexRouter.post("/create-message", membersController.createMessagePost)

module.exports = indexRouter;