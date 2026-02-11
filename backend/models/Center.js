const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  centerId: {
    type: String,
    required: true,
    unique: true
  },
  centerName: {
    type: String,
    required: true
  },
  town: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  inchargeInt: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Center', centerSchema);
