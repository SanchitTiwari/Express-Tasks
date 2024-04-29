const bcrypt = require('bcryptjs');
const User = require('../models/model.js');

const registerUser = async (req, res) => {
    try {
        const { username, password, email, id, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            id,
            firstName,
            lastName
        });
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } 
    catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
    }
};

const loginUser = async (req, res) => {
    try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        res.status(200).json({ access_token: user._id });
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
    }
};
const getUser = async (req, res) => {
    try {
        const access_token = req.headers['access_token'];
        const user = await User.findOne({ _id: access_token });
        if (!user) {
            return res.status(400).json({ error: 'Invalid access token' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const deleteUser = async (req, res) => {
    try {
        const access_token = req.headers['access_token'];
        const user = await User.findOne({ _id: access_token });
        if (!user) {
            return res.status(400).json({ error: 'Invalid access token' });
        }
        await User.deleteOne({ _id: access_token });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
    }
};

const listUsers = async (req, res) => {
    try {
        const page = parseInt(req.params.page);
        const usersPerPage = 10;
        const skip = (page - 1) * usersPerPage;
        const users = await User.find().skip(skip).limit(usersPerPage);
        res.status(200).json(users);
    } 
    catch (err) {
    console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { registerUser, loginUser, getUser, deleteUser, listUsers };
