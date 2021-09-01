const {ExpressError} = require('../utils');

module.exports = (req, res, next) => {
  const {role} = req.user;

  if (role !== 'DRIVER') {
    next(new ExpressError('This action only available for DRIVER'));
  } else {
    next();
  }
};
