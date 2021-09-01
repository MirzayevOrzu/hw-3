/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {catchAsync} = require('../utils');
const {truckControllers} = require('../controllers');
const {isAuthenticated, isDriver} = require('../middlewares');

router.use(isAuthenticated);
router.use(isDriver);

router
    .route('/')
    .post(catchAsync(truckControllers.addTruck))
    .get(catchAsync(truckControllers.getTrucks));

router
    .route('/:truckId')
    .get(catchAsync(truckControllers.getTruck))
    .put(catchAsync(truckControllers.updateTruck))
    .delete(catchAsync(truckControllers.deleteTruck));

router
    .route('/:truckId/assign')
    .post(catchAsync(truckControllers.assignTruck));

module.exports = router;
