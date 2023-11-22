const db = require("../db/connection");

exports.selectCommentsByArticleID = (article_id) => {
  return db
    .query(
      `SELECT *
      FROM comments
      WHERE article_id=$1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
         WHERE comment_id = $1
         RETURNING*;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
};
