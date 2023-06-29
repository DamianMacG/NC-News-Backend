const db = require("../db/connection");

exports.getArticlesById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};

exports.getAllArticles = (topic, sort_by = "created_at", order_by = "DESC") => {
  const validSorts = [
    "article_id",
    "title",
    "author",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC"];
  const queryValues = [];
  const validTopics = ["cats", "mitch", "paper"];
  let queryString = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INTEGER AS comment_count
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort value" });
  }
  if (!validOrders.includes(order_by.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  }

  if (topic) {
    if (!validTopics.includes(topic)) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }

    queryValues.push(topic);
    queryString += ` WHERE articles.topic = $1`;
  }

  queryString += ` GROUP BY articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url`;
  queryString += ` ORDER BY ${sort_by} ${order_by};`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.getAllArticleIdComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.includes(article_id)) {
        return [];
      }
      return result.rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.checkUsernameExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Username not found" });
      }
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $2
      WHERE article_id = $1
      RETURNING *
    `,
      [article_id, inc_votes]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};
