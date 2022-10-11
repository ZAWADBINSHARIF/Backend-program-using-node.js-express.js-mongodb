const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fsPromises = require('fs').promises;

const userDB = {
    users: require('../model/users.json'),
    setUsers: function (person) { this.users = person; }
};

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required' });
    const foundUser = userDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); // UNAUTHORIZED
    try {
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            const roles = Object.values(foundUser.roles);
            // create jwt token
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
            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )
            const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
            const currentUser = { ...foundUser, refreshToken: refreshToken };
            userDB.setUsers([...otherUsers, currentUser]);

            await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users));
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { handleLogin }