'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authLoginController')

router.post('/', authController.handleLogin);

module.exports = router;