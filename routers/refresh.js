'use strict';

const express = require('express');
const router = express.Router();
const refreshToken = require('../controllers/refreshTokenController.js');

router.get('/', refreshToken.handleRefreshToken);

module.exports = router;