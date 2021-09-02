/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {catchAsync} = require('../utils');
const {loadControllers} = require('../controllers');
const {isAuthenticated, isShipper, isDriver} = require('../middlewares');

router.use(isAuthenticated);

router
    .route('/')
    .post(isShipper, catchAsync(loadControllers.addLoad))
    .get(catchAsync(loadControllers.getLoads));

router
    .route('/active')
    .get(isDriver, catchAsync(loadControllers.getActiveLoad));

router
    .route('/active/state')
    .patch(isDriver, catchAsync(loadControllers.iterateLoadState));

router
    .route('/:loadId')
    .get(catchAsync(loadControllers.getLoad))
    .put(isShipper, catchAsync(loadControllers.updateLoad))
    .delete(isShipper, catchAsync(loadControllers.deleteLoad));

router
    .route('/:loadId/post')
    .post(isShipper, catchAsync(loadControllers.postLoad));

router
    .route('/:loadId/shipping_info')
    .get(isShipper, catchAsync(loadControllers.getShippingInfo));

module.exports = router;
