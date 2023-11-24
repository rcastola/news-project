const express = require("express");

const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./errors");

const apiRouter = require("./routes/api-router");
const userRouter = require("./routes/user-router");
const topicRouter = require("./routes/topic-router");
const commentRouter = require("./routes/comment-router");
const articleRouter = require("./routes/article-router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/users", userRouter);
app.use("/api/topics", topicRouter);
app.use("/api/comments", commentRouter);
app.use("/api/articles", articleRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
