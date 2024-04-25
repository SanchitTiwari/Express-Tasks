const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./model.js');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
router.post('/register', [
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
                    .custom(async (value) => {
                        const user = await User.findOne({ username: value });
                        if (user) {
                            return Promise.reject('Username already exists'); // unique username
                        }
                    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password'); // validation for confirm match
        }
        return true;
    }),
    body('email').isEmail().withMessage('Invalid email')
                 .custom(async (value) => {
                     const user = await User.findOne({ email: value });
                     if (user) {
                         return Promise.reject('Email already exists'); // custom validation check wheather the email already exists or not
                     }
                 }),
                body('id').optional().isMongoId().withMessage('Invalid ID'),
                body('firstName').optional().trim().notEmpty().withMessage('First name is required'),
                body('lastName').optional().trim().notEmpty().withMessage('Last name is required')
], validate, async (req, res) => {
    try {
        const { username, password, email, id, firstName, lastName } = req.body;

        // The password stored in the database would be encrypted using bcryptjs
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/login', async (req, res) => {
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
});

module.exports = router;
