
const express = require('express');
const { registerUser, logoutUser } = require('../controllers/userController');
const { loginUser } = require("../controllers/userController")

require('dotenv').config()

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

//Route for user logout
router.post('/logout', logoutUser);

module.exports = router;
