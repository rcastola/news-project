const { getTopics, postTopics } = require("../controllers/topics.controller");

const topicRouter = require("express").Router();

topicRouter.route("/").get(getTopics).post(postTopics);

module.exports = topicRouter;
