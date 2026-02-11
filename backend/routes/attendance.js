const express = require('express');
const router = express.Router();
const { StudentAttendance, InstructorAttendance } = require('../models/Attendance');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/attendance/students
// @desc    Get student attendance records
// @access  Private
router.get('/students', protect, async (req, res) => {
  try {
    const attendance = await StudentAttendance.find()
      .populate('studentId', 'studentId name')
      .populate('centerId', 'centerName town city');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/attendance/instructors
// @desc    Get instructor attendance records
// @access  Private
router.get('/instructors', protect, async (req, res) => {
  try {
    const attendance = await InstructorAttendance.find()
      .populate('instructorId', 'universityId name')
      .populate('centerId', 'centerName town city');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/attendance/students
// @desc    Mark student attendance
// @access  Private/Center/Admin
router.post('/students', protect, authorize('admin', 'center'), async (req, res) => {
  try {
    const { date, studentId, centerId, status } = req.body;

    const attendance = await StudentAttendance.create({
      date,
      studentId,
      centerId,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/attendance/instructors
// @desc    Mark instructor attendance
// @access  Private/Center/Admin
router.post('/instructors', protect, authorize('admin', 'center'), async (req, res) => {
  try {
    const { date, instructorId, centerId, status } = req.body;

    const attendance = await InstructorAttendance.create({
      date,
      instructorId,
      centerId,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/attendance/students/:id
// @desc    Update student attendance
// @access  Private/Center/Admin
router.put('/students/:id', protect, authorize('admin', 'center'), async (req, res) => {
  try {
    const attendance = await StudentAttendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    const { status } = req.body;
    attendance.status = status || attendance.status;

    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/attendance/instructors/:id
// @desc    Update instructor attendance
// @access  Private/Center/Admin
router.put('/instructors/:id', protect, authorize('admin', 'center'), async (req, res) => {
  try {
    const attendance = await InstructorAttendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    const { status } = req.body;
    attendance.status = status || attendance.status;

    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
