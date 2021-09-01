/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {catchAsync} = require('../utils');
const {userControllers} = require('../controllers');
const {isAuthenticated} = require('../middlewares');

router.use(isAuthenticated);

router
    .route('/me')
    .get(catchAsync(userControllers.getProfileInfo))
    .delete(catchAsync(userControllers.deleteProfile));

router.patch('/me/password', catchAsync(userControllers.changePassword));

module.exports = router;
