const db = require("../db/connection");

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      `SELECT *
        FROM articles
        WHERE article_id=$1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
};
exports.selectArticles = (topic) => {
  let queryValues = [];
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  FULL OUTER JOIN comments
  ON articles.article_id=comments.article_id`;

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE topic=$1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;
  } else {
    queryStr += ` GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;
  }
  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    } else {
      return rows;
    }
  });
};

exports.updateArticles = (articleVoteChange, article_id) => {
  return db
    .query(
      `UPDATE articles
      SET votes= votes + $1
      WHERE article_id= $2
      RETURNING article_id, title, topic, author, created_at, votes, article_img_url;
      `,
      [articleVoteChange, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
};
