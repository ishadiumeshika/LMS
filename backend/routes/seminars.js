const express = require('express');
const router = express.Router();
const Seminar = require('../models/Seminar');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/seminars
// @desc    Get all seminars
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const seminars = await Seminar.find()
      .populate('centerId', 'centerName town city')
      .populate('instructorId', 'name universityId');
    res.json(seminars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/seminars/:id
// @desc    Get single seminar
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id)
      .populate('centerId', 'centerName town city')
      .populate('instructorId', 'name universityId');
    
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    
    res.json(seminar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/seminars
// @desc    Create seminar
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, description, date, time, venue, centerId, instructorId, status } = req.body;

    const seminar = await Seminar.create({
      title,
      description,
      date,
      time,
      venue,
      centerId,
      instructorId,
      status,
    });

    res.status(201).json(seminar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/seminars/:id
// @desc    Update seminar
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    const { title, description, date, time, venue, centerId, instructorId, status } = req.body;

    seminar.title = title || seminar.title;
    seminar.description = description || seminar.description;
    seminar.date = date || seminar.date;
    seminar.time = time || seminar.time;
    seminar.venue = venue || seminar.venue;
    seminar.centerId = centerId || seminar.centerId;
    seminar.instructorId = instructorId || seminar.instructorId;
    seminar.status = status || seminar.status;

    const updatedSeminar = await seminar.save();
    res.json(updatedSeminar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/seminars/:id
// @desc    Delete seminar
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    await seminar.deleteOne();
    res.json({ message: 'Seminar removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
