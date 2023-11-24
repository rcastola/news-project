const {
  getUsers,
  getUsersByUsername,
} = require("../controllers/users.controller");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUsersByUsername);

module.exports = userRouter;
