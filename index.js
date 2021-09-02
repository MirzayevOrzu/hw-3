const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {
  authRoutes,
  userRoutes,
  truckRoutes,
  laodRoutes,
} = require('./src/routes');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/loads', laodRoutes);

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if (!err.message) err.message = 'Server error';
  res.status(statusCode).json({
    message: err.message,
  });
});

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 8080;
mongoose.connect(DB_URL, {useNewUrlParser: true}, (err) => {
  if (err) {
    console.log('Database connection error');
  } else {
    console.log('Database connection open');
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  }
});
