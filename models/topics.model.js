const db = require("../db/connection");

exports.selectTopics = () => {
  return db
    .query(
      `SELECT *
        FROM topics;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertTopics = (newTopic) => {
  return db
    .query(
      `INSERT INTO topics (description, slug)
  VALUES
  ($1, $2)
  RETURNING *;`,
      [newTopic.description, newTopic.slug]
    )
    .then((newTopics) => {
      return newTopics.rows[0];
    });
};
