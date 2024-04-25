const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { validate, validateToken } = require('./middleware');
const { registerUser, loginUser, getUser, deleteUser, listUsers } = require('./controller');

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
],
 validate, registerUser);

router.post('/login', loginUser);

router.get('/get', validateToken, getUser);

router.delete('/delete', validateToken, deleteUser);

router.get('/list/:page', listUsers);

module.exports = router;
