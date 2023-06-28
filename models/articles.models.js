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

exports.getAllArticles = () => {
  return db
    .query(
      `
    SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INTEGER AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
  `
    )
    .then((result) => {
      return result.rows;
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
