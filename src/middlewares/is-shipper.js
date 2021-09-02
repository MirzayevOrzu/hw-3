const {ExpressError} = require('../utils');

module.exports = (req, res, next) => {
  const {role} = req.user;

  if (role !== 'SHIPPER') {
    next(new ExpressError('This action only available for SHIPPER'));
  } else {
    next();
  }
};
