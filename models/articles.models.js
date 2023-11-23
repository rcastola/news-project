const db = require("../db/connection");

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
        FROM articles
        FULL OUTER JOIN comments
        ON articles.article_id=comments.article_id
        WHERE articles.article_id=$1
        GROUP BY articles.article_id;`,
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
exports.selectArticles = (topic, sort_by, order = `DESC`) => {
  const validTopics = ["mitch", "cats", "paper"];
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  let queryValues = [];
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  FULL OUTER JOIN comments
  ON articles.article_id=comments.article_id`;

  if (topic && validTopics.includes(topic)) {
    queryValues.push(topic);
    queryStr += ` WHERE topic=$1`;
  } else if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  queryStr += ` GROUP BY articles.article_id`;

  if (order !== "ASC" && order !== "DESC") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (!sort_by && !order) {
    queryStr += ` ORDER BY created_at DESC;`;
  } else if (!sort_by && order) {
    queryStr += ` ORDER BY created_at ${order};`;
  } else if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    queryStr += ` ORDER BY ${sort_by} ${order};`;
  }

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
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
