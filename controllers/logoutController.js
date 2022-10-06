const jwt = require('jsonwebtoken');
const path = require('path');
const fsPromises = require('fs').promises;
require('dotenv').config();

const userDB = {
    users: require('../model/users.json'),
    setUsers: function (person) { this.users = person; }
}

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones. 
    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(user => user.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        res.sendStatus(204) // no content send for this request
    }
    const otherUsers = userDB.users.filter(user => user.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users));
    res.clearCookie('jwt', { httpOnly: true });
    res.sendStatus(204) // no content send for this request
};

module.exports = { handleLogout };