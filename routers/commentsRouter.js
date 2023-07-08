const express = require("express");
const router = express.Router();
const {
  deleteComment,
  updateCommentById,
} = require("../controllers/comments.controller");

router.delete("/:comment_id", deleteComment);
router.patch("/:comment_id", updateCommentById);

module.exports = router;