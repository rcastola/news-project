const { selectArticleByID } = require("../models/articles.models");
const {
  selectCommentsByArticleID,
  removeComment,
  updateComment,
} = require("../models/comments.model");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const commentsPromises = [
    selectArticleByID(article_id),
    selectCommentsByArticleID(article_id, limit, p),
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const commentVoteChange = req.body.inc_votes;
  const { comment_id } = req.params;
  updateComment(commentVoteChange, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
