const db = require("../db/connection");

exports.deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return result.rowCount;
    });
};

exports.updateCommentVotes = (commentId, incVotes) => {
  if (typeof incVotes !== "number" || incVotes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad request - Invalid inc_votes value" });
  }

  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
      [incVotes, commentId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return result.rows[0];
    });
};
