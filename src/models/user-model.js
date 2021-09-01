const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['SHIPPER', 'DRIVER'],
  },
  createdDate: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
