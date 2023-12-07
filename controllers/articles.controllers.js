const {
  selectArticleByID,
  selectArticles,
  updateArticles,
  insertArticles,
  removeArticle,
} = require("../models/articles.models");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;
  selectArticles(topic, sort_by, order, limit, p)
    .then((articles) => {
      res
        .status(200)
        .send({ articles: articles, total_count: articles.length });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticles = (req, res, next) => {
  const articleVoteChange = req.body.inc_votes;
  const article_id = req.params.article_id;

  updateArticles(articleVoteChange, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postArticles = (req, res, next) => {
  const newArticle = req.body;

  insertArticles(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
