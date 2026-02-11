const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Instructor = require('../models/Instructor');
const { protect, JWT_SECRET } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/register/instructor
// @desc    Register a new instructor
// @access  Public
router.post('/register/instructor', async (req, res) => {
  try {
    const { username, email, password, universityId, name } = req.body;

    // Validate email domain
    if (!email.endsWith('@eng.pdn.ac.lk')) {
      return res.status(400).json({ 
        message: 'Email must end with @eng.pdn.ac.lk' 
      });
    }

    // Validate university ID format
    const universityIdRegex = /^E-\d{2}-\d{3}$/;
    if (!universityIdRegex.test(universityId)) {
      return res.status(400).json({ 
        message: 'University ID must follow format E-YY-XXX (e.g., E-23-001)' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: 'instructor',
      universityId,
      name,
    });

    // Create instructor profile
    const instructor = await Instructor.create({
      universityId,
      name,
      email,
      userId: user._id,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
