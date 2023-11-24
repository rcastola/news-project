const {
  deleteComment,
  patchComment,
} = require("../controllers/comments.controllers");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentRouter;
