const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/auth');
const Instructor = require('../models/Instructor');

// Get all instructors
router.get('/', auth, async (req, res) => {
  try {
    const instructors = await Instructor.find().populate('centerId');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single instructor
router.get('/:id', auth, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('centerId');
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign instructor to center (Admin or Center)
router.put('/:id/assign-center', auth, authorizeRoles('admin', 'center'), async (req, res) => {
  try {
    const { centerId } = req.body;

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { centerId },
      { new: true, runValidators: true }
    ).populate('centerId');

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update instructor (Admin only)
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, centerId } = req.body;

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { name, centerId },
      { new: true, runValidators: true }
    ).populate('centerId');

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete instructor (Admin only)
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
