const express = require("express");
const app = express();

const topicsRouter = require("./routers/topicsRouter");
const apiRouter = require("./routers/apiRouter");
const articlesRouter = require("./routers/articlesRouter");
const usersRouter = require("./routers/usersRouter");
const commentsRouter = require("./routers/commentsRouter");

const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors/errors");

app.use(express.json());

app.use("/api/topics", topicsRouter);
app.use("/api", apiRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.all("*", (_, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
