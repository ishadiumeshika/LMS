const mongoose = require('mongoose');

const SeminarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Seminar', SeminarSchema);
