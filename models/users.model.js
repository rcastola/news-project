const db = require("../db/connection");

exports.selectUsers = () => {
  return db
    .query(
      `SELECT *
        FROM users;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectUsersByUsername = (username) => {
  return db
    .query(
      `SELECT *
        FROM users
        WHERE username=$1;`,
      [username]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
};
