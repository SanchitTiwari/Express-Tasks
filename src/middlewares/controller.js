const md5 = require('md5');
const bcrypt = require('bcryptjs');
const User = require('../models/model.js');
const AccessToken = require('../models/accessTokenModel.js');


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
        // creating token if the username/password requests are fulfilled which expires in 1 hour
        const token = md5(new Date().toISOString() + user._id); // access token generated with md5 hashing alogorithm
        const expiry = new Date(new Date().getTime() + (60 * 60 * 1000)); // expiration set for 1 hour

        const newAccessToken = new AccessToken({
            user_id: user._id,
            access_token: token,
            expiry: expiry
        });
        await newAccessToken.save();
        // responded with generated access token and expiration time
        res.status(200).json({ access_token: token, expires_in: '1 hour' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getUser = async (req, res) => {
    try {
        const access_token = req.query.access_token;
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

// added logic for address insertion and saving it into the database 

const addAddress = async (req, res) => {
    try {
        const { user_id, address, city, state, pin_code, phone_no } = req.body;
        const access_token = req.headers['access_token'];
        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.addresses.push({ address, city, state, pin_code, phone_no });
        await user.save();
        res.status(200).json({ message: 'Address added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = { registerUser, loginUser, getUser, deleteUser, listUsers, addAddress  };
