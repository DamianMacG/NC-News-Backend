const { getAllTopics, createTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  createTopic({ slug, description })
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
