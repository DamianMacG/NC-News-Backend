const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
// const { getArticles } = require("./controllers/articles.controller");

const {
  handleBadPaths,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
// app.get("/api/articles", getArticles);

app.use(handleBadPaths);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
