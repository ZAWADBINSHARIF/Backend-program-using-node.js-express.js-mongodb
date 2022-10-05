const jwt = require('jsonwebToken');
require('dotenv').config();

const userDB = {
    users: require('../model/users.json'),
    setUsers: function (person) { this.users = person }
};
const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // unauthorized
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(perosn => perosn.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); // forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // forbidden
            const accessToken = jwt.sign(
                { username: decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };