const fs = require("fs/promises");

exports.selectApis = () => {
  return fs.readFile("endpoints.json", "utf8").then((endpoints) => {
    const readableEndpoints = JSON.parse(endpoints);
    return readableEndpoints;
  });
};
