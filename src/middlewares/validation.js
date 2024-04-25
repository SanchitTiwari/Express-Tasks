const { body } = require('express-validator');
const User = require('./src/models/model.js');

const validateRegistration = [
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                return Promise.reject('Username already exists');
            }
        }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    body('email').isEmail().withMessage('Invalid email')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                return Promise.reject('Email already exists');
            }
        }),
    body('id').optional().isMongoId().withMessage('Invalid ID'),
    body('firstName').optional().trim().notEmpty().withMessage('First name is required'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name is required')
];


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateToken = async (req, res, next) => {
    const access_token = req.headers['access_token'];
    if (!access_token) {
        return res.status(400).json({ error: 'Access token is missing' });
    }
    next();
};

module.exports = { validateRegistration, validate, validateToken };
