const { insertComment } = require("../models/insertcomments.models");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(newComment, article_id)
    .then((comments) => {
      res.status(201).send({ comments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
