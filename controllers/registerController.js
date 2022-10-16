'use strict';

const bcrypt = require('bcrypt');
const User = require('../model/User.js');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: "Username and Password are required" });
    // check user duplicate
    const duplicate = await User.findOne({ username: user }).exec();
    console.log(duplicate);
    if (duplicate) return res.status(409).json({ message: `'${user}' this username already used. Please use another usename!!` }) // conflict
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10,);
        const newUser = await User.create({
            username: user,
            password: hashedPwd,
        });

        console.log(newUser);
       
        res.status(201).json({ message: "New user created " + user + " successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };