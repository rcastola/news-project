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
} = require("./controllers/articles.controllers");
const { getApis } = require("./controllers/apis.controllers");
const { postComment } = require("./controllers/postcomments.controllers");

const {
  getCommentsByArticleID,
} = require("./controllers/comments.controllers");

const app = express();
app.use(express.json());

app.get("/api", getApis);

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postComment);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
