const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/auth');
const { StudentAttendance, InstructorAttendance } = require('../models/Attendance');

// Get student attendance (All authenticated users can view)
router.get('/students', auth, async (req, res) => {
  try {
    const { startDate, endDate, centerId, studentId } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (centerId) {
      query.centerId = centerId;
    }
    
    if (studentId) {
      query.studentId = studentId;
    }

    // If student role, only show their own attendance
    if (req.user.role === 'student' && req.user.referenceId) {
      query.studentId = req.user.referenceId;
    }

    // If center role, only show attendance from their center
    if (req.user.role === 'center' && req.user.referenceId) {
      query.centerId = req.user.referenceId;
    }

    const attendance = await StudentAttendance.find(query)
      .populate('studentId')
      .populate('centerId')
      .populate('markedBy', 'username role')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get instructor attendance (All authenticated users can view)
router.get('/instructors', auth, async (req, res) => {
  try {
    const { startDate, endDate, centerId, instructorId } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (centerId) {
      query.centerId = centerId;
    }
    
    if (instructorId) {
      query.instructorId = instructorId;
    }

    // If instructor role, only show their own attendance
    if (req.user.role === 'instructor' && req.user.referenceId) {
      query.instructorId = req.user.referenceId;
      console.log('Instructor viewing own attendance. ReferenceId:', req.user.referenceId);
    }

    // If center role, only show attendance from their center
    if (req.user.role === 'center' && req.user.referenceId) {
      query.centerId = req.user.referenceId;
    }

    console.log('Attendance query:', query);
    const attendance = await InstructorAttendance.find(query)
      .populate('instructorId')
      .populate('centerId')
      .populate('markedBy', 'username role')
      .sort({ date: -1 });

    console.log('Found attendance records:', attendance.length);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark student attendance (Admin and Center can mark)
router.post('/students', auth, authorizeRoles('admin', 'center'), async (req, res) => {
  try {
    const { date, studentId, centerId, status } = req.body;

    // Check if attendance already exists for this date and student
    const existingAttendance = await StudentAttendance.findOne({
      date: new Date(date),
      studentId
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = new StudentAttendance({
      date: new Date(date),
      studentId,
      centerId,
      status,
      markedBy: req.userId
    });

    await attendance.save();
    await attendance.populate(['studentId', 'centerId', 'markedBy']);

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk mark student attendance (Admin only)
router.post('/students/bulk', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { records } = req.body; // Array of { date, studentId, centerId, status }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Records array is required' });
    }

    const Student = require('../models/Student');

    const results = {
      success: [],
      failed: []
    };

    for (const record of records) {
      try {
        const { date, studentId, centerId, status } = record;

        // Find student by studentId field
        const student = await Student.findOne({ studentId: studentId });
        if (!student) {
          results.failed.push({
            record,
            error: `Student not found with ID: ${studentId}`
          });
          continue;
        }

        // Check if attendance already exists
        const existingAttendance = await StudentAttendance.findOne({
          date: new Date(date),
          studentId: student._id
        });

        if (existingAttendance) {
          results.failed.push({
            record,
            error: 'Attendance already marked for this date'
          });
          continue;
        }

        const attendance = new StudentAttendance({
          date: new Date(date),
          studentId: student._id,
          centerId,
          status: status || 'present',
          markedBy: req.userId
        });

        await attendance.save();
        results.success.push(attendance);
      } catch (error) {
        results.failed.push({
          record,
          error: error.message
        });
      }
    }

    res.status(201).json({
      message: `${results.success.length} records created, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark instructor attendance (Admin and Center can mark)
router.post('/instructors', auth, authorizeRoles('admin', 'center'), async (req, res) => {
  try {
    const { date, instructorId, centerId, status } = req.body;

    // Check if attendance already exists for this date and instructor
    const existingAttendance = await InstructorAttendance.findOne({
      date: new Date(date),
      instructorId
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = new InstructorAttendance({
      date: new Date(date),
      instructorId,
      centerId,
      status,
      markedBy: req.userId
    });

    await attendance.save();
    await attendance.populate(['instructorId', 'centerId', 'markedBy']);

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk mark instructor attendance (Admin only)
router.post('/instructors/bulk', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { records } = req.body; // Array of { date, instructorId, centerId, status }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Records array is required' });
    }

    const Instructor = require('../models/Instructor');

    const results = {
      success: [],
      failed: []
    };

    for (const record of records) {
      try {
        const { date, instructorId, centerId, status } = record;

        // Find instructor by universityId (e.g., E-23-001)
        const instructor = await Instructor.findOne({ universityId: instructorId });
        if (!instructor) {
          results.failed.push({
            record,
            error: `Instructor not found with university ID: ${instructorId}`
          });
          continue;
        }

        console.log(`Found instructor: ${instructor.name} (${instructor.universityId}), _id: ${instructor._id}`);

        // Check if attendance already exists
        const existingAttendance = await InstructorAttendance.findOne({
          date: new Date(date),
          instructorId: instructor._id
        });

        if (existingAttendance) {
          results.failed.push({
            record,
            error: 'Attendance already marked for this date'
          });
          continue;
        }

        const attendance = new InstructorAttendance({
          date: new Date(date),
          instructorId: instructor._id,
          centerId,
          status: status || 'present',
          markedBy: req.userId
        });

        await attendance.save();
        console.log(`Attendance saved for instructor ${instructor.universityId} on ${date}`);
        results.success.push(attendance);
      } catch (error) {
        results.failed.push({
          record,
          error: error.message
        });
      }
    }

    res.status(201).json({
      message: `${results.success.length} records created, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student attendance (Admin and Center can update)
router.put('/students/:id', auth, authorizeRoles('admin', 'center'), async (req, res) => {
  try {
    const { status } = req.body;

    const attendance = await StudentAttendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate(['studentId', 'centerId', 'markedBy']);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update instructor attendance (Admin and Center can update)
router.put('/instructors/:id', auth, authorizeRoles('admin', 'center'), async (req, res) => {
  try {
    const { status } = req.body;

    const attendance = await InstructorAttendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate(['instructorId', 'centerId', 'markedBy']);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete student attendance (Admin only)
router.delete('/students/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const attendance = await StudentAttendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete instructor attendance (Admin only)
router.delete('/instructors/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const attendance = await InstructorAttendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
