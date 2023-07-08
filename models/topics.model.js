const db = require("../db/connection");

exports.getAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.createTopic = ({ slug, description }) => {
  if (!slug || slug === "") {
    return Promise.reject({
      status: 400,
      msg: "Bad request - missing 'slug' property",
    });
  }
  if (!description || description === "") {
    return Promise.reject({
      status: 400,
      msg: "Bad request - missing 'description' property",
    });
  }

  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *",
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};
