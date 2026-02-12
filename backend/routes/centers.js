const express = require('express');
const router = express.Router();
const Center = require('../models/Center');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get all centers (public - for registration)
router.get('/public', async (req, res) => {
  try {
    const centers = await Center.find()
      .select('_id center_id center_name town city')
      .sort({ center_name: 1 });
    
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all centers (authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const centers = await Center.find()
      .populate('instructors', 'name email instructor_id')
      .populate('students', 'name email student_id')
      .sort({ createdAt: -1 });
    
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get center by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const center = await Center.findById(req.params.id)
      .populate('instructors', 'name email instructor_id')
      .populate('students', 'name email student_id age gender grade');
    
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    res.json(center);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create center (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { center_id, center_name, town, city } = req.body;

    // Check if center_id already exists
    const existingCenter = await Center.findOne({ center_id });
    if (existingCenter) {
      return res.status(400).json({ message: 'Center ID already exists' });
    }

    const center = new Center({
      center_id,
      center_name,
      town,
      city
    });

    await center.save();
    res.status(201).json({ message: 'Center created successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update center (Admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { center_name, town, city } = req.body;

    const center = await Center.findByIdAndUpdate(
      req.params.id,
      { center_name, town, city },
      { new: true, runValidators: true }
    );

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json({ message: 'Center updated successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete center (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const center = await Center.findByIdAndDelete(req.params.id);

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign instructor to center (Admin only)
router.post('/:id/instructors/:instructorId', auth, isAdmin, async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    const instructor = await User.findById(req.params.instructorId);

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (!center.instructors.includes(instructor._id)) {
      center.instructors.push(instructor._id);
      await center.save();
    }

    res.json({ message: 'Instructor assigned to center successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign student to center (Admin only)
router.post('/:id/students/:studentId', auth, isAdmin, async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    const student = await User.findById(req.params.studentId);

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!center.students.includes(student._id)) {
      center.students.push(student._id);
      student.center = center._id;
      await center.save();
      await student.save();
    }

    res.json({ message: 'Student assigned to center successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
