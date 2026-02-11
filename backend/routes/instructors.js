const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/instructors
// @desc    Get all instructors
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const instructors = await Instructor.find().populate('centerId', 'centerName town city');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/instructors/:id
// @desc    Get single instructor
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('centerId', 'centerName town city');
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/instructors/:id/assign-center
// @desc    Assign instructor to center
// @access  Private/Center/Admin
router.put('/:id/assign-center', protect, authorize('admin', 'center'), async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const { centerId } = req.body;
    instructor.centerId = centerId;

    const updatedInstructor = await instructor.save();
    res.json(updatedInstructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
