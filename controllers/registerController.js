const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;

const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};
const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: "Username and Password are required" });
    // check user duplicate
    const duplicate = userDB.users?.find(person => person.username === user);
    if (duplicate) return res.status(409).json({ message: `'${user}' this username already used. Please use another usename!!` }) // conflict
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10,);
        const newUser = {
            username: user,
            password: hashedPwd,
            roles: { "viewer": 2001 }
        };
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users));
        res.status(201).json({ message: "New user created " + user + " successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };