const db = require("../db/connection");

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.article_img_url, articles.votes,
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
exports.selectArticles = (topic, sort_by, order = `DESC`, limit, p) => {
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
    let numStartResults = 0;
    let numEndResults = 10;
    const numRegex = /\d/g;
    const maxNumPages = Math.ceil(rows.length / limit);

    if (limit && !numRegex.test(limit)) {
      return Promise.reject({ status: 400, msg: "bad request" });
    } else if (p && (Number(p) > maxNumPages || p.match(numRegex) === null)) {
      return Promise.reject({ status: 400, msg: "bad request" });
    } else if (limit && p) {
      numStartResults = limit * (p - 1);
      numEndResults = limit * p;
    }
    const finalResults = rows.slice(numStartResults, numEndResults);

    return finalResults;
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

exports.insertArticles = (newArticle) => {
  if (newArticle.article_img_url === undefined) {
    newArticle.article_img_url = "no img url provided";
  }
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;`,
      [
        newArticle.title,
        newArticle.topic,
        newArticle.author,
        newArticle.body,
        newArticle.article_img_url,
      ]
    )
    .then((newArticle) => {
      newArticle.rows[0].comment_count = 0;
      //unsure if comment_count key inserted in the correct way here
      return newArticle.rows[0];
    });
};

exports.removeArticle = (article_id) => {
  return db
    .query(
      `DELETE FROM articles
    WHERE article_id = $1
    RETURNING*;`,
      [article_id]
    )

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
};
