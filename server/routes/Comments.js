const express = require("express");

const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/:postId", (request, response) => {
    const { postId } = request.params;
    const comments = Comments.findAll({ where: { PostId: postId } }).then(
        (comments) => {
            response.json(comments);
        }
    );
});

router.post("/", validateToken, (request, response) => {
    const comment = request.body;
    const username = request.user.username;
    comment.username = username;
    Comments.create(comment).then((comment) => {
        response.json(comment);
    });
});

router.delete("/:commentId", validateToken, (request, response) => {
    const { commentId } = request.params;
    Comments.destroy({ where: { id: commentId } }).then(() => {
        response.status(200).send()
    });
});

module.exports = router;
