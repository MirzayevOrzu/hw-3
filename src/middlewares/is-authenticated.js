/* eslint-disable camelcase */
const {ExpressError} = require('../utils');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const {authorization} = req.headers;
  const [auth_type, auth_value] = authorization.split(' ');

  if (auth_type === 'JWT') {
    jwt.verify(auth_value, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(auth_value);
        next(new ExpressError('Token is not valid', 400));
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};
