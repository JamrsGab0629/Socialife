const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const generateToken = (userId) => {
    const jti = crypto.randomUUID(); // gawa ng id for jwt for cookie and blocklisted

    return jwt.sign(
        { userId, jti },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = {
    generateToken
};