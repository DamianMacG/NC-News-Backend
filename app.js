const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const {
  getArticles,
  getArticleById,
  getArticleIdComments,
  postComment,
  updateArticle,
} = require("./controllers/articles.controller");

const { getAllUsers } = require("./controllers/users.controller");

const { deleteComment } = require("./controllers/comments.controller");

const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors/errors");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
// app.get("/api/query/articles", queryArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleIdComments);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", updateArticle);
app.delete("/api/comments/:comment_id", deleteComment);


app.get("/api/users", getAllUsers);

app.all("*", (_, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
