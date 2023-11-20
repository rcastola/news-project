const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      `SELECT *
        FROM articles;`
    )
    .then(({ rows }) => {
      const finalRows = rows.map((element) => {
        const elementCopy = { ...element };
        delete elementCopy.body;
        return elementCopy;
      });
      return finalRows;
    });
};

/*exports.selectTreasures = (sort_by = `age`, order = `ASC`, colour) => {
  const validSortBy = [
    "treasure_id",
    "treasure_name",
    "colour",
    "age",
    "cost_at_auction",
    "shop_id",
  ];

  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (order !== "ASC" && order !== "DESC") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let queryStr = `SELECT * FROM treasures`;
  const queryValues = [];

  if (colour) {
    queryValues.push(colour);
    queryStr += ` WHERE colour = $1`;
  }

  queryStr += ` ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
    return rows;
  });
};*/
