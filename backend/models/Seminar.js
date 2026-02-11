const mongoose = require('mongoose');

const seminarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Seminar', seminarSchema);
