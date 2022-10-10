const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization; // authorization means that the user has permission to access
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(403);
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // invalid token
            req.user = decoded.user;
            next();
        }
    )
}

module.exports = verifyJWT;