const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./errors");
const { getArticleByID } = require("./controllers/articles.controllers");
const { handleServerErrors } = require("./errors");
const { getApis } = require("./controllers/apis.controllers");
const { getArticles } = require("./controllers/allArticles.controller");

const app = express();

//app.use(express.json());
app.get("/api", getApis);

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
