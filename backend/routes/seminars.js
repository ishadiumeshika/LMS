const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/auth');
const Seminar = require('../models/Seminar');

// Get all seminars (All authenticated users can view)
router.get('/', auth, async (req, res) => {
  try {
    const seminars = await Seminar.find()
      .populate('centerId')
      .populate('instructorId')
      .sort({ date: -1 });
    res.json(seminars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single seminar
router.get('/:id', auth, async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id)
      .populate('centerId')
      .populate('instructorId');
    
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    res.json(seminar);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create seminar (Admin only)
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, description, date, time, venue, centerId, instructorId } = req.body;

    const seminar = new Seminar({
      title,
      description,
      date,
      time,
      venue,
      centerId,
      instructorId
    });

    await seminar.save();
    await seminar.populate(['centerId', 'instructorId']);

    res.status(201).json(seminar);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update seminar (Admin only)
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, description, date, time, venue, centerId, instructorId, status } = req.body;

    const seminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      { title, description, date, time, venue, centerId, instructorId, status },
      { new: true, runValidators: true }
    ).populate(['centerId', 'instructorId']);

    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    res.json(seminar);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete seminar (Admin only)
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const seminar = await Seminar.findByIdAndDelete(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    res.json({ message: 'Seminar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
