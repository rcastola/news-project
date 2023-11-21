const { selectArticleByID } = require("../models/articles.models");
const { selectCommentsByArticleID } = require("../models/comments.model");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;

  const commentsPromises = [
    selectArticleByID(article_id),
    selectCommentsByArticleID(article_id),
  ];

  Promise.all(commentsPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
