const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assigned_to: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    required: true,
    enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
  },
  status: {
    type: String,
    enum: ['OL', 'IS', null],
    default: null,
  },
  created_date: {
    type: Date,
    required: true,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('Truck', truckSchema);
