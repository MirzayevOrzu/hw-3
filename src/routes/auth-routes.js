/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {catchAsync} = require('../utils');
const {authControllers} = require('../controllers');
const {authValidate} = require('../middlewares');

router.post('/register', authValidate, catchAsync(authControllers.register));
router.post('/login', authValidate, catchAsync(authControllers.login));
router.post('forgot_password');

module.exports = router;
