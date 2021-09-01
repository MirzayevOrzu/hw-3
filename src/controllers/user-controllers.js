const {User} = require('../models');
const bcrypt = require('bcrypt');
const {ExpressError} = require('../utils/');

module.exports.getProfileInfo = async (req, res, next) => {
  const {id, email} = req.user;

  const user = await User.findById(id);

  res.status(200).json({
    user: {
      _id: id,
      role: user.role,
      email,
      created_date: user.createdDate,
    },
  });
};

module.exports.changePassword = async (req, res, next) => {
  const {id} = req.user;
  const {oldPassword, newPassword} = req.body;

  const user = await User.findById(id);
  const match = await bcrypt.compare(oldPassword, user.password);

  if (!match) {
    return next(new ExpressError('Incorrect password', 400));
  }

  const password = bcrypt.hashSync(newPassword, 10);
  user.password = password;
  await user.save();

  res.status(200).json({
    message: 'Password changed successfully',
  });
};

module.exports.deleteProfile = async (req, res, next) => {
  const {id} = req.user;

  await User.findByIdAndRemove(id);

  res.status(200).json({
    message: 'Profile deleted successfully',
  });
};