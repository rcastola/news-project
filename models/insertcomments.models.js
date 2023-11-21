const db = require("../db/connection");

exports.insertComment = (newComment, article_id) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
      [newComment.body, newComment.author, article_id]
    )
    .then((newComment) => {
      return newComment.rows[0];
    });
};
