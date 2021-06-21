const express = require("express");

const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/", validateToken, (request, response) => {
    const { PostId } = request.body;
    const UserId = request.user.id;

    Likes.findOne({ where: { PostId, UserId } }).then((alreadyLiked) => {
        if (!alreadyLiked)
            Likes.create({ PostId, UserId }).then(() => {
                response.json({ liked: true });
            });
        else
            Likes.destroy({ where: { PostId, UserId } }).then(() => {
                response.json({ liked: false });
            });
    });
});

module.exports = router;
