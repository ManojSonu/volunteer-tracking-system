const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  aadhar: {
    type: String,
    required: [true, 'Aadhar is required'],
    unique: [true, 'Aadhar already exist']
  },
  password: {
    type: String
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    unique: [true, 'Phone already exist'],
    required: [true, 'User phone number required']
  },
  address: {
    type: String
  },
  type: {
    type: String,
    enum: ['staff', 'admin', 'volunteer'],
    default: 'volunteer'
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
},
  { strict: false }
);

module.exports = User = mongoose.model('users', UserSchema);