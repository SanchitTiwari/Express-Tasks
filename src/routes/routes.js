const express = require('express');
const router = express.Router();
const { validateRegistration, validate, validateToken } = require('../middlewares/validation');
const { registerUser, loginUser, getUser, deleteUser, listUsers, addAddress } = require('../middlewares/controller');
const passport = require('passport')

//UPDATED ALL THE ROUTES TO FOLLOW REST API NAMING CONVENTIONS

// user registration route
router.post('/users/register', validateRegistration, validate, registerUser);

// Login route with Passport JS Authentication

router.post('/users/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {        //authentication Failed
            return res.status(401).json({ message: 'Invalid username or password' });
        }
                            // authentication successful
        return res.status(200).json({ message: 'Login successful', user: user });
    })(req, res, next);
});

// Get user details
router.get('/users/:userId',getUser);

// Delete user
router.delete('/users/:userId',deleteUser);

// List users with pagination
router.get('/users/list/:page', listUsers);

// Add address to user
router.post('/users/:userId/address', addAddress);

const userRoutes = router;
module.exports = userRoutes;