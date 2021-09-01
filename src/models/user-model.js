const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
},
{
  versionKey: false,
});

module.exports = mongoose.model('User', userSchema);
