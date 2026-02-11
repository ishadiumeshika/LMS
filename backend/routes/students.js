const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/auth');
const Student = require('../models/Student');
const Center = require('../models/Center');

// Get all students (Admin and Center can view)
router.get('/', auth, authorizeRoles('admin', 'center'), async (req, res) => {
  try {
    let query = {};
    
    // If center role, only show students from their center
    if (req.user.role === 'center' && req.user.referenceId) {
      query.centerId = req.user.referenceId;
    }

    const students = await Student.find(query).populate('centerId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('centerId');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create student (Admin only)
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { studentId, name, ageOrGrade, gender, centerId } = req.body;

    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    const student = new Student({
      studentId,
      name,
      ageOrGrade,
      gender,
      centerId
    });

    await student.save();
    await student.populate('centerId');

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student (Admin only)
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, ageOrGrade, gender, centerId } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, ageOrGrade, gender, centerId },
      { new: true, runValidators: true }
    ).populate('centerId');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete student (Admin only)
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
