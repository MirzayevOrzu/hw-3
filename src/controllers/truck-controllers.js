const {Truck} = require('../models');
const {ExpressError} = require('../utils');

module.exports.addTruck = async (req, res, next) => {
  const {id} = req.user;
  const {type} = req.body;

  const truck = new Truck({
    created_by: id,
    assigned_to: null,
    type,
    status: 'IS',
  });
  await truck.save();

  res.status(200).json({
    message: 'Truck created successfully',
  });
};

module.exports.getTrucks = async (req, res, next) => {
  const {id} = req.user;

  const trucks = await Truck.find({created_by: id}).select('-_v');

  res.status(200).json({
    trucks,
  });
};

module.exports.getTruck = async (req, res, next) => {
  const {id} = req.user;
  const {truckId} = req.params;

  const truck = await Truck
      .findOne({_id: truckId, created_by: id});

  if (!truck) {
    return next(new ExpressError(`No truck found with "_id" of ${truckId}`));
  }

  res.status(200).json({
    truck,
  });
};

module.exports.getTruck = async (req, res, next) => {
  const {id} = req.user;
  const {truckId} = req.params;

  const truck = await Truck
      .findOne({_id: truckId, created_by: id});

  if (!truck) {
    return next(new ExpressError(`No truck found with "_id" of ${truckId}`));
  }

  res.status(200).json({
    truck,
  });
};

module.exports.updateTruck = async (req, res, next) => {
  const {id} = req.user;
  const {truckId} = req.params;
  const {type} = req.body;

  const truck = await Truck.findOneAndUpdate(
      {
        _id: truckId,
        created_by: id,
        assigned_to: null,
      },
      {type},
  );

  if (!truck) {
    return next(new ExpressError(`No truck found with "_id" of ${truckId}`));
  }

  res.status(200).json({
    message: 'Truck details changed successfully',
  });
};

module.exports.deleteTruck = async (req, res, next) => {
  const {id} = req.user;
  const {truckId} = req.params;

  await Truck.findOneAndRemove({_id: truckId, created_by: id});

  res.status(200).json({
    message: 'Truck deleted successfully',
  });
};

module.exports.assignTruck = async (req, res, next) => {
  const {id} = req.user;
  const {truckId} = req.params;

  const assignedTruck = await Truck.findOne({created_by: id, assigned_to: id});

  if (assignedTruck) {
    return next(new ExpressError(`You have a assigned truck.`, 400));
  }

  Truck.findOneAndUpdate(
      {created_by: id, _id: truckId},
      {assigned_to: id},
      (err) => {
        if (err) return next(new ExpressError('Database error', 500));
        res.status(200).json({
          message: 'Truck assigned successfully',
        });
      },
  );
};
