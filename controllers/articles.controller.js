const { getArticlesById, getAllArticles } = require("../models/articles.model");

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

// exports.getArticles = (req, res, next) => {
//   getAllArticles()
//     .then((articles) => res.status(200).send({ articles }))
//     .catch((err) => {
//       next(err);
//     });
// };
