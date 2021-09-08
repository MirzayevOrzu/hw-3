/* eslint-disable camelcase */
const {Load, Truck} = require('../models');
const TruckO = require('../oop/truck');
const {ExpressError} = require('../utils');

module.exports.addLoad = async (req, res, next) => {
  const {id} = req.user;
  const {
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
  } = req.body;

  const load = new Load({
    created_by: id,
    assigned_to: null,
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
    created_date: new Date().toISOString(),
  });
  await load.save();

  res.status(200).json({
    message: 'Load created successfully',
  });
};

module.exports.getLoads = async (req, res, next) => {
  const {id, role} = req.user;
  const {status, limit, offset} = req.query;
  const fixedLimit = Number(limit) === 0 ?
    Number(limit) > 50 ? 50 : Number(limit) : 10;

  const query = role === 'SHIPPER' ? {created_by: id} : {assigned_to: id};
  status ? query.status = status : null;
  const loads = await Load
      .find(query)
      .lean()
      .sort('created_date')
      .skip(Number(offset || 0))
      .limit(fixedLimit);

  res.status(200).json({
    loads,
  });
};

module.exports.getActiveLoad = async (req, res, next) => {
  const {id} = req.user;

  const load = await Load
      .findOne({assigned_to: id, status: {$ne: 'SHIPPED'}})
      .select('-truck')
      .lean();

  if (!load) {
    return next(new ExpressError('No active load found'));
  }

  res.status(200).json({
    load,
  });
};

module.exports.iterateLoadState = async (req, res, next) => {
  const {id} = req.user;
  const states = [
    'En route to Pick Up',
    'Arrived to Pick Up',
    'En route to delivery',
    'Arrived to delivery',
  ];

  const load = await Load.findOne({assigned_to: id, status: {$ne: 'SHIPPED'}});
  if (!load) {
    return next(new ExpressError('No active load found'));
  }

  const index = states.indexOf(load.state);
  if (index === 3) {
    return next(new ExpressError('Load is in final state already', 400));
  }

  load.state = states[index + 1];
  load.logs.push({
    message: `Load state changed to "${states[index + 1]}"`,
    time: new Date().toISOString(),
  });
  if (index === 2) {
    load.status = 'SHIPPED';
    load.logs.push({
      message: 'Load shipped successfully',
      time: new Date().toISOString(),
    });
    await Truck.findByIdAndUpdate(
        load.truck,
        {status: 'IS', assigned_to: null},
    );
  }
  await load.save();

  res.status(200).json({
    message: `Load state changed to '${states[index + 1]}'`,
  });
};

module.exports.getLoad = async (req, res, next) => {
  const {id} = req.user;
  const {loadId} = req.params;

  const load = await Load.findOne({_id: loadId, created_by: id}).lean();

  if (!load) {
    return next(new ExpressError(`No load found with "_id" of ${loadId}`));
  }

  res.status(200).json({
    load,
  });
};


module.exports.updateLoad = async (req, res, next) => {
  const {id} = req.user;
  const {loadId} = req.params;
  const {
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
  } = req.body;

  Load.findOneAndUpdate(
      {created_by: id, _id: loadId},
      {
        name,
        payload,
        pickup_address,
        delivery_address,
        dimensions,
      },
      (err) => {
        if (err) return next(new ExpressError('Datatbase error', 500));
        res.status(200).json({
          message: 'Load details changed successfully',
        });
      },
  );
};

module.exports.deleteLoad = async (req, res, next) => {
  const {id} = req.user;
  const {loadId} = req.params;

  await Load.findOneAndRemove({_id: loadId, created_by: id});

  res.status(200).json({
    message: 'Load deleted successfully',
  });
};

module.exports.postLoad = async (req, res, next) => {
  const {id} = req.user;
  const {loadId} = req.params;

  const load = await Load.findOne({_id: loadId, created_by: id});

  if (!load) {
    return next(new ExpressError(`No load found with "_id" of ${loadId}`));
  }

  const trucks = await Truck.find({assigned_to: {$ne: null}, status: 'IS'});

  for (const truck of trucks) {
    const {payload, dimensions: {length, width, height}} = load;
    const truckChar = new TruckO(truck.type);

    const acceptable = truckChar.acceptableLoad(length, width, height, payload);
    if (acceptable) {
      load.assigned_to = truck.created_by;
      load.truck = truck._id;
      load.status = 'ASSIGNED';
      load.logs.push({
        message: `Load assigned to driver with id ${truck.created_by}`,
        time: new Date().toISOString(),
      });
      truck.status = 'OL';
      await truck.save();
      await load.save();
      return res.status(200).json({
        message: 'Load posted successfully',
        driver_found: true,
      });
    }
  }

  load.logs.push({
    message: 'Load posted, but driver not found',
    time: new Date().toISOString(),
  });
  await load.save();
  next(new ExpressError('Available drivers not found', 500));
};

module.exports.getShippingInfo = async (req, res, next) => {
  const {id} = req.user;
  const {loadId} = req.params;

  const load = await Load
      .findOne({_id: loadId, created_by: id})
      .populate('truck');

  if (!load) {
    return next(new ExpressError(`No load found with "_id" of ${loadId}`));
  }

  res.status(200).json({
    load,
  });
};
