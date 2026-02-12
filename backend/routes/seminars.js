const express = require('express');
const router = express.Router();
const Seminar = require('../models/Seminar');
const { auth, isAdmin } = require('../middleware/auth');

// Get all seminars
router.get('/', auth, async (req, res) => {
  try {
    const seminars = await Seminar.find()
      .populate('center', 'center_name town city')
      .populate('instructor', 'name email instructor_id')
      .sort({ date: -1 });
    
    res.json(seminars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get seminar by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id)
      .populate('center', 'center_name town city')
      .populate('instructor', 'name email instructor_id');
    
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    
    res.json(seminar);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create seminar (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, date, center, instructor, status } = req.body;

    const seminar = new Seminar({
      title,
      description,
      date,
      center,
      instructor,
      status: status || 'scheduled'
    });

    await seminar.save();
    
    const populatedSeminar = await Seminar.findById(seminar._id)
      .populate('center', 'center_name town city')
      .populate('instructor', 'name email instructor_id');

    res.status(201).json({ 
      message: 'Seminar created successfully', 
      seminar: populatedSeminar 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update seminar (Admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, date, center, instructor, status } = req.body;

    const seminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      { title, description, date, center, instructor, status },
      { new: true, runValidators: true }
    )
      .populate('center', 'center_name town city')
      .populate('instructor', 'name email instructor_id');

    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    res.json({ message: 'Seminar updated successfully', seminar });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete seminar (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
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

// Get seminars by center
router.get('/center/:centerId', auth, async (req, res) => {
  try {
    const seminars = await Seminar.find({ center: req.params.centerId })
      .populate('center', 'center_name town city')
      .populate('instructor', 'name email instructor_id')
      .sort({ date: -1 });
    
    res.json(seminars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
