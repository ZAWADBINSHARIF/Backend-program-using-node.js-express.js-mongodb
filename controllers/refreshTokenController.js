const jwt = require('jsonwebToken');

const userDB = {
    users: require('../model/users.json'),
    setUsers: function (person) { this.users = person }
};
const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // unauthorized
    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(perosn => perosn.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); // forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // forbidden
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        'username': foundUser.username,
                        'roles': roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };