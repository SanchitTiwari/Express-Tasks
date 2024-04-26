const express = require('express');
const router = express.Router();
const { validateRegistration, validate, validateToken } = require('../middlewares/validation');
const { registerUser, loginUser, getUser, deleteUser, listUsers } = require('../middlewares/controller');

router.post('/register', validateRegistration, validate, registerUser);

router.post('/login', loginUser);

router.get('/get', validateToken, getUser);

router.delete('/delete', validateToken, deleteUser);

router.get('/list/:page', listUsers);
const userRoutes = router;
module.exports = userRoutes;
