const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const {
  getArticles,
  getArticleById,
  getArticleIdComments,
} = require("./controllers/articles.controller");

const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors/errors");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleIdComments);

app.all("*", (_, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
