const { verify } = require("jsonwebtoken");

const validateToken = (request, response, next) => {
    const accessToken = request.header("accessToken");

    if (!accessToken) return response.json({ error: "User Not Logged In" });

    try {
        const info = verify(accessToken, "importantsecret"); // should return the unhashed user object
        request.user = info;
        if (info) return next();
    } catch (error) {
        response.json({ error });
    }
};

module.exports = { validateToken };
