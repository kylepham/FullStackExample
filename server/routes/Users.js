const express = require("express");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/", (request, response) => {
    const { username, password } = request.body;
    bcrypt.hash(password, 10).then((result) => {
        Users.create({
            username,
            password: result,
        }).then(() => {
            response.status(200).send();
        });
    });
});

router.post("/login", async (request, response) => {
    const { username, password } = request.body;

    const user = await Users.findOne({ where: { username } });

    if (!user) response.json({ error: "User Doesn't Exist" });

    bcrypt.compare(password, user.password).then((result) => {
        if (!result)
            response.json({
                error: "Username and Password Combination is Incorrect",
            });

        const accessToken = sign(
            { username: user.username, id: user.id },
            "importantsecret"
        );

        response.json({ accessToken, username, id: user.id });
    });
});

router.get("/auth", validateToken, (request, response) => {
    response.json(request.user);
});

router.get("/basicInfo/:id", (request, response) => {
    const { id } = request.params;
    Users.findByPk(id, { attributes: { exclude: ["password"] } }).then(
        (user) => {
            response.json(user);
        }
    );
});

router.put("/changepassword", validateToken, (request, response) => {
    const { oldPassword, newPassword } = request.body;
    Users.findOne({
        where: { username: request.user.username },
    }).then(user => {
        bcrypt.compare(oldPassword, user.password).then((matched) => {
            if (!matched)
                response.json({
                    error: "Wrong Password Entered",
                });
    
            bcrypt.hash(newPassword, 10).then((result) => {
                Users.update(
                    {
                        password: result,
                    },
                    { where: { username: user.username } }
                ).then(() => {
                    response.status(200).send();
                });
            });
        });
    });

    
});
module.exports = router;
