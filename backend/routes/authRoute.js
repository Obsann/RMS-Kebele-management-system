const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/authmodel.js')
const {register, login, checkUser} = require('../controllers/authController.js');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/checkUser', checkUser);

module.exports = router;