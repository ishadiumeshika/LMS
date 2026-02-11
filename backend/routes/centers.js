const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/auth');
const Center = require('../models/Center');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Get all centers
router.get('/', auth, async (req, res) => {
  try {
    const centers = await Center.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single center
router.get('/:id', auth, async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json(center);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create center (Admin only)
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { centerId, centerName, town, city, inchargeInt, username, password } = req.body;

    const existingCenter = await Center.findOne({ centerId });
    if (existingCenter) {
      return res.status(400).json({ message: 'Center ID already exists' });
    }

    const center = new Center({
      centerId,
      centerName,
      town,
      city,
      inchargeInt
    });

    await center.save();

    // Create user account for center if username and password provided
    if (username && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        password: hashedPassword,
        role: 'center',
        referenceId: center._id,
        referenceModel: 'Center'
      });
      await user.save();
    }

    res.status(201).json(center);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update center (Admin only)
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { centerName, town, city, inchargeInt } = req.body;

    const center = await Center.findByIdAndUpdate(
      req.params.id,
      { centerName, town, city, inchargeInt },
      { new: true, runValidators: true }
    );

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json(center);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete center (Admin only)
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
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

module.exports = router;
