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

const {
  getAllUsers,
  getUserByUsername,
} = require("./controllers/users.controller");

const { deleteComment, updateCommentById } = require("./controllers/comments.controller");

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
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleIdComments);
app.get("/api/users", getAllUsers);
app.get("/api/users/:username", getUserByUsername);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", updateArticle);
app.patch("/api/comments/:comment_id", updateCommentById);
app.delete("/api/comments/:comment_id", deleteComment);



app.all("*", (_, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
