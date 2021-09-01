const {User} = require('../models');
const {ExpressError} = require('../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res, next) => {
  const {
    email,
    password,
    role,
  } = req.body;
  console.log(req.url);

  const existingUser = await User.findOne({email});
  if (existingUser) {
    return next(new ExpressError(`User ${email} already exist`, 400));
  };

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({email, role, password: hashedPassword});
  await user.save();

  res.status(200).json({
    message: 'Profile created successfully',
  });
};

module.exports.login = async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if (!user) {
    return next(new ExpressError(`No user ${email} found`, 400));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new ExpressError('Invalid password', 400));
  }

  const token = jwt.sign(
      {id: user._id, email},
      process.env.JWT_SECRET,
      {expiresIn: '5h'},
  );

  res.status(200).json({
    jwt_token: token,
  });
};
