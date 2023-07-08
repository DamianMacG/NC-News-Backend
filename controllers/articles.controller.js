const {
  getArticlesById,
  getAllArticles,
  getAllArticleIdComments,
  insertComment,
  checkUsernameExists,
  updateArticleVotes,
  createArticle,
  deleteArticle,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  getArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const topic = req.query.topic;
  const sort_by = req.query.sort_by;
  const order_by = req.query.order_by;

  getAllArticles(topic, sort_by, order_by)
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleIdComments = (req, res, next) => {
  const { article_id } = req.params;
  const { limit = 5, p = 1 } = req.query;
  const offset = limit * p - limit;

  const promises = [
    getAllArticleIdComments(article_id, limit, offset),
    getArticlesById(article_id),
  ];

  if (article_id) {
    promises.push(getArticlesById(article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      const article = resolvedPromises[1];
      res.status(200).send({ comments, article });
    })
    .catch(next);
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return next({ status: 400, msg: "Missing username or body" });
  }

  const promises = [checkUsernameExists(username)];
  if (article_id) {
    promises.push(getArticlesById(article_id));
  }
  Promise.all(promises)
    .then(() => {
      insertComment(article_id, username, body).then((comment) => {
        res.status(201).send({ comment });
      });
    })

    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Invalid vote increment value" });
  }

  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  if (!author || !title || !body || !topic || !article_img_url) {
    return res.status(400).send({ msg: "Bad request" });
  }
  createArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const article_id = req.params.article_id;

  deleteArticle(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
