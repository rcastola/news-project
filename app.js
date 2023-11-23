const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./errors");
const {
  getArticleByID,
  getArticles,
  patchArticles,
} = require("./controllers/articles.controllers");
const { getApis } = require("./controllers/apis.controllers");
const { postComment } = require("./controllers/postcomments.controllers");

const {
  getCommentsByArticleID,
  deleteComment,
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controller");

const app = express();
app.use(express.json());

app.get("/api", getApis);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.patch("/api/articles/:article_id", patchArticles);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api/users", getUsers);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
