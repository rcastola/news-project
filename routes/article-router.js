const {
  getArticles,
  getArticleByID,
  patchArticles,
  postArticles,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticleID,
} = require("../controllers/comments.controllers");
const { postComment } = require("../controllers/postcomments.controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticles);

articleRouter.route("/:article_id").get(getArticleByID).patch(patchArticles);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postComment);

module.exports = articleRouter;
