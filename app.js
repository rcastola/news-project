const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { handleServerErrors } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use(handleServerErrors);

module.exports = app;
