const express = require('express');
const router = express.Router();
const { validateRegistration, validate, validateToken } = require('../middlewares/validation');
const { registerUser, loginUser, getUser, deleteUser, listUsers, addAddress } = require('../middlewares/controller');

router.post('/register', validateRegistration, validate, registerUser);

router.post('/login', loginUser);

router.get('/get', validateToken, getUser);

router.delete('/delete', validateToken, deleteUser);

router.get('/list/:page', listUsers);

router.post('/address', validateToken, addAddress); //added route for address post request  

const userRoutes = router;
module.exports = userRoutes;
