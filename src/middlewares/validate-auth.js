const {ExpressError} = require('../utils');

module.exports = (req, res, next) => {
  const {email, password, role} = req.body;
  const {url} = req;

  if (!email) {
    next(new ExpressError('"email" field is required in body', 400));
  }

  if ((url === '/register' || url === '/login') && !password) {
    next(new ExpressError('"password field is required in body', 400));
  }

  if (url === '/register' && !role) {
    next(new ExpressError('"role" field is required in body', 400));
  }

  next();
};
