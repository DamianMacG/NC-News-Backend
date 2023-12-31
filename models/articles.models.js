const db = require("../db/connection");

exports.getArticlesById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::INTEGER AS comment_count
       FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};

exports.getAllArticles = (
  topic,
  sort_by = "created_at",
  order_by = "DESC",
  limit,
  offset
) => {
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
  queryString += ` ORDER BY ${sort_by} ${order_by}`;

  if (limit) {
    queryString += ` LIMIT ${limit}`;
    if (offset) {
      queryString += ` OFFSET ${offset}`;
    }
  }

  const countQueryString = `SELECT COUNT(*)::INTEGER AS total_count FROM articles`;

  return Promise.all([
    db.query(queryString, queryValues),
    db.query(countQueryString),
  ]).then(([result, countResult]) => {
    const articles = result.rows;
    const total_count = countResult.rows[0].total_count;
    return { articles, total_count };
  });
};

exports.getAllArticleIdComments = (article_id, limit, offset) => {
  return db
    .query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [article_id, limit, offset]
    )
    .then((result) => {
      if (
        result.rows.some((comment) => comment.article_id === article_id) &&
        result.rows.length === 0
      ) {
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

exports.createArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `
  INSERT INTO articles (author, title, body, topic, article_img_url)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *, 0 AS comment_count
`,
      [author, title, body, topic, article_img_url]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.deleteArticle = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rowCount;
    });
};
