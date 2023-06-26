const fs = require("fs");

exports.getEndpoints = (req, res) => {
  const endpoints = JSON.parse(fs.readFileSync("./endpoints.json"));
  res.status(200).json(endpoints);
};
