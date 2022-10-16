'use strict';

const User = require('../model/User.js');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!(cookies?.jwt)) return res.sendStatus(204); // There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones. 
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
        res.sendStatus(204) // no content send for this request
    };
    // foundUser.refreshToken = ''
    // await foundUser.save();
    // console.log(foundUser);
    await User.findOneAndUpdate({ username: foundUser.username }, { refreshToken: '' }, { upsert: true });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
    res.sendStatus(204); // no content send for this request
};

module.exports = { handleLogout };