const { getApis } = require("../controllers/apis.controllers");

const apiRouter = require("express").Router();

apiRouter.get("/", getApis);

module.exports = apiRouter;
