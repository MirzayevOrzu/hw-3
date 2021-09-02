const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    requied: true,
  },
  time: {
    type: Date,
    required: true,
    default: new Date().toISOString(),
  },
}, {_id: false});

const loadSchema = new Schema({
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
    required: true,
    default: 'NEW',
  },
  state: {
    type: String,
    enum: [
      'En route to Pick Up',
      'Arrived to Pick Up',
      'En route to delivery',
      'Arrived to delivery',
    ],
    default: 'En route to Pick Up',
  },
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  logs: {
    type: [messageSchema],
    default: [],
  },
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: false,
  },
  created_date: {
    type: Date,
    required: true,
    default: new Date().toISOString(),
  },
},
{
  versionKey: false,
},
);

module.exports = mongoose.model('Load', loadSchema);
