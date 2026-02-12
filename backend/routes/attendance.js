const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get all attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { date, center, seminar } = req.query;
    const filter = {};
    
    if (date) filter.date = new Date(date);
    if (center) filter.center = center;
    if (seminar) filter.seminar = seminar;

    const attendance = await Attendance.find(filter)
      .populate('student', 'name email student_id')
      .populate('instructor', 'name email instructor_id')
      .populate('center', 'center_name town city')
      .populate('seminar', 'title date')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get attendance by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('student', 'name email student_id')
      .populate('instructor', 'name email instructor_id')
      .populate('center', 'center_name town city')
      .populate('seminar', 'title date');
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create attendance record (Admin only) - for student
router.post('/student', auth, isAdmin, async (req, res) => {
  try {
    const { date, student_id, center, seminar, status, notes } = req.body;

    // Find student by ID
    const student = await User.findOne({ student_id, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = new Attendance({
      date: new Date(date),
      student: student._id,
      student_id: student.student_id,
      center,
      seminar,
      status: status || 'present',
      notes
    });

    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('student', 'name email student_id')
      .populate('center', 'center_name town city')
      .populate('seminar', 'title date');

    res.status(201).json({ 
      message: 'Student attendance recorded successfully', 
      attendance: populatedAttendance 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already recorded for this student on this date/seminar' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create attendance record (Admin only) - for instructor
router.post('/instructor', auth, isAdmin, async (req, res) => {
  try {
    const { date, instructor_id, center, seminar, status, notes } = req.body;

    // Find instructor by instructor_id
    const instructor = await User.findOne({ instructor_id, role: 'instructor' });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const attendance = new Attendance({
      date: new Date(date),
      instructor: instructor._id,
      instructor_id: instructor.instructor_id,
      center,
      seminar,
      status: status || 'present',
      notes
    });

    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('instructor', 'name email instructor_id')
      .populate('center', 'center_name town city')
      .populate('seminar', 'title date');

    res.status(201).json({ 
      message: 'Instructor attendance recorded successfully', 
      attendance: populatedAttendance 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already recorded for this instructor on this date/seminar' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk create attendance records (Admin only)
router.post('/bulk', auth, isAdmin, async (req, res) => {
  try {
    const { records } = req.body; // Array of attendance records
    
    const createdRecords = [];
    const errors = [];

    for (const record of records) {
      try {
        let attendance;
        
        if (record.student_id) {
          const student = await User.findOne({ student_id: record.student_id, role: 'student' });
          if (!student) {
            errors.push({ record, error: 'Student not found' });
            continue;
          }
          
          attendance = new Attendance({
            date: new Date(record.date),
            student: student._id,
            student_id: student.student_id,
            center: record.center,
            seminar: record.seminar,
            status: record.status || 'present',
            notes: record.notes
          });
        } else if (record.instructor_id) {
          const instructor = await User.findOne({ instructor_id: record.instructor_id, role: 'instructor' });
          if (!instructor) {
            errors.push({ record, error: 'Instructor not found' });
            continue;
          }
          
          attendance = new Attendance({
            date: new Date(record.date),
            instructor: instructor._id,
            instructor_id: instructor.instructor_id,
            center: record.center,
            seminar: record.seminar,
            status: record.status || 'present',
            notes: record.notes
          });
        }

        await attendance.save();
        createdRecords.push(attendance);
      } catch (err) {
        errors.push({ record, error: err.message });
      }
    }

    res.status(201).json({ 
      message: 'Bulk attendance creation completed',
      created: createdRecords.length,
      errors: errors.length,
      records: createdRecords,
      errorDetails: errors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update attendance record (Admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    )
      .populate('student', 'name email student_id')
      .populate('instructor', 'name email instructor_id')
      .populate('center', 'center_name town city')
      .populate('seminar', 'title date');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance updated successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete attendance record (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get my attendance (for students and instructors)
router.get('/my/records', auth, async (req, res) => {
  try {
    const filter = {};
    
    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (req.user.role === 'instructor') {
      filter.instructor = req.user._id;
    } else {
      return res.status(403).json({ message: 'This endpoint is for students and instructors only' });
    }

    const attendance = await Attendance.find(filter)
      .populate('center', 'center_name town city')
      .populate('seminar', 'title date description')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
