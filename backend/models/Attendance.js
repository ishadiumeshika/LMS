const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  },
}, {
  timestamps: true,
});

const instructorAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  },
}, {
  timestamps: true,
});

const StudentAttendance = mongoose.model('StudentAttendance', studentAttendanceSchema);
const InstructorAttendance = mongoose.model('InstructorAttendance', instructorAttendanceSchema);

module.exports = { StudentAttendance, InstructorAttendance };
