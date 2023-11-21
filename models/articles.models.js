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
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
         COUNT(comments.comment_id) AS comment_count
         FROM articles
         FULL OUTER JOIN comments
         ON articles.article_id=comments.article_id
         GROUP BY articles.article_id
         ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
