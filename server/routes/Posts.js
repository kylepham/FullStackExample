const express = require("express");

const { Posts, Likes } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();
router.get("/", validateToken, (request, response) => {
    Posts.findAll({ include: [Likes] }).then(async (posts) => {
        Likes.findAll({
            where: { UserId: request.user.id },
        }).then((likedPosts) => {
            response.json({ posts, likedPosts });
        });
    });
});

router.get("/byId/:id", (request, response) => {
    const { id } = request.params;

    const post = Posts.findByPk(id).then((post) => {
        response.json(post);
    });
});

router.get("/byUserId/:id", (request, response) => {
    const { id } = request.params;

    Posts.findAll({ where: { UserId: id }, include: [Likes] }).then((posts) => {
        response.json(posts);
    });
});

router.post("/", validateToken, (request, response) => {
    const post = request.body;
    post.username = request.user.username;
    post.UserId = request.user.id;
    Posts.create(post)
        .then((post) => {
            response.json(post);
        })
        .catch((error) => console.log(error));
});

router.put("/title", validateToken, (request, response) => {
    const {title, id} = request.body;
    Posts.update({title}, { where: { id }}).then(() => {
        response.json(title)
    })
});

router.put("/body", validateToken, (request, response) => {
    const {postText, id} = request.body;
    Posts.update({postText}, { where: { id }}).then(() => {
        response.json(postText)
    })
});

router.delete("/:postId", validateToken, (request, response) => {
    const { postId } = request.params;
    Posts.destroy({ where: { id: postId } }).then(() => {
        response.status(200).send();
    });
});
module.exports = router;
