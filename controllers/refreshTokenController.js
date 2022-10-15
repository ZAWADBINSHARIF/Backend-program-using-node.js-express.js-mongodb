const jwt = require('jsonwebToken');
const User = require('../model/User.js');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!(cookies?.jwt)) return res.sendStatus(401); // unauthorized
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refdreshToken: refreshToken }).exec();
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
                { expiresIn: '300s' }
            );
            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };