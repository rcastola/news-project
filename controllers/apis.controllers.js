const fs = require("fs/promises");
const { selectApis } = require("../models/apis.models");

exports.getApis = (req, res, next) => {
  selectApis().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};
