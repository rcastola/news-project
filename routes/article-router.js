const {
  getArticles,
  getArticleByID,
  patchArticles,
  postArticles,
  deleteArticle,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticleID,
} = require("../controllers/comments.controllers");
const { postComment } = require("../controllers/postcomments.controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleByID)
  .patch(patchArticles)
  .delete(deleteArticle);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postComment);

module.exports = articleRouter;
