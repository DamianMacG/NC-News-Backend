const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticleById,
  getArticleIdComments,
  postComment,
  updateArticle,
  addArticle,
  deleteArticleById
} = require("../controllers/articles.controller");

router.get("/", getArticles);
router.get("/:article_id", getArticleById);
router.get("/:article_id/comments", getArticleIdComments);
router.post("/:article_id/comments", postComment);
router.patch("/:article_id", updateArticle);
router.post("/", addArticle);
router.delete("/:article_id", deleteArticleById)

module.exports = router;