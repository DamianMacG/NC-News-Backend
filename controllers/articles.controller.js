const {
  getArticlesById,
  getAllArticles,
  getAllArticleIdComments,
  insertComment,
  checkUsernameExists,
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

  const promises = [getAllArticleIdComments(article_id)];
  if (article_id) {
    promises.push(getArticlesById(article_id));
  }
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
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
  if (body) {
    promises.push(insertComment(article_id, username, body));
  }
  Promise.all(promises)
    .then(() => {
      insertComment(article_id, username, body).then((comment) => {
        res.status(201).send({ comment });
      });
    })

    .catch(next);
};
