const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const {
  handleBadPaths,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

const app = express();

app.get("/api/topics", getTopics);

app.use(handleBadPaths);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;