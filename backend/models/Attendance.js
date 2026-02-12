const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  seminar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminar'
  },
  // For student attendance
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  student_id: {
    type: String
  },
  // For instructor attendance
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  instructor_id: {
    type: String
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate attendance records
AttendanceSchema.index({ date: 1, student: 1, seminar: 1 }, { unique: true, sparse: true });
AttendanceSchema.index({ date: 1, instructor: 1, seminar: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
