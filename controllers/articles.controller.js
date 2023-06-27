const { getArticlesById, getAllArticles, insertComment } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  getArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  getAllArticles()
    .then((articles) => res.status(200).send({ articles }))
    .catch((err) => {
      next(err);
    });
};









exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).json({ comment });
    })
    .catch(next);
};