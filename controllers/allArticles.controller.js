const { selectArticles } = require("../models/allArticles.model");

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

/*
exports.getTreasures = (req, res, next) => {
  const { sort_by, order, colour } = req.query;

  selectTreasures(sort_by, order, colour)
    .then((treasures) => {
      res.status(200).send({ treasures });
    })
    .catch((err) => {
      next(err);
    });
};*/
