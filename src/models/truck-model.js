const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['S0PRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
  },
  status: {
    type: String,
    enum: ['OL', 'IS', null],
    default: null,
  },
  createdDate: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
});

module.exports = mongoose.model('Truck', truckSchema);
