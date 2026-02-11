const express = require('express');
const router = express.Router();
const Center = require('../models/Center');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/centers
// @desc    Get all centers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const centers = await Center.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/centers/:id
// @desc    Get single center
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    res.json(center);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/centers
// @desc    Create center
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { centerId, centerName, town, city, inchargeInt } = req.body;

    const center = await Center.create({
      centerId,
      centerName,
      town,
      city,
      inchargeInt,
    });

    res.status(201).json(center);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/centers/:id
// @desc    Update center
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    const { centerId, centerName, town, city, inchargeInt } = req.body;

    center.centerId = centerId || center.centerId;
    center.centerName = centerName || center.centerName;
    center.town = town || center.town;
    center.city = city || center.city;
    center.inchargeInt = inchargeInt || center.inchargeInt;

    const updatedCenter = await center.save();
    res.json(updatedCenter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/centers/:id
// @desc    Delete center
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    await center.deleteOne();
    res.json({ message: 'Center removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
