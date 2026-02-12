const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema({
  center_id: {
    type: String,
    required: true,
    unique: true
  },
  center_name: {
    type: String,
    required: true,
    trim: true
  },
  town: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Center', CenterSchema);
