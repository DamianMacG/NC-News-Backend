const {
  getArticlesById,
  getAllArticles,
  getAllArticleIdComments,
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
  getAllArticles()
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleIdComments = (req, res, next) => {
  const { article_id } = req.params;
  getAllArticleIdComments(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};
