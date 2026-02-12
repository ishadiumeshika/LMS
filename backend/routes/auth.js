const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'instructor', 'student']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, instructor_id, student_id, age, gender, grade, center } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate instructor email domain
    if (role === 'instructor' && !email.endsWith('@eng.pdn.ac.lk')) {
      return res.status(400).json({ message: 'Instructor email must be from @eng.pdn.ac.lk domain' });
    }

    // Check if instructor_id already exists
    if (role === 'instructor' && instructor_id) {
      const existingInstructor = await User.findOne({ instructor_id });
      if (existingInstructor) {
        return res.status(400).json({ message: 'This Instructor ID is already registered' });
      }
    }

    // Check if student_id already exists
    if (role === 'student' && student_id) {
      const existingStudent = await User.findOne({ student_id });
      if (existingStudent) {
        return res.status(400).json({ message: 'This Student ID is already registered' });
      }
    }

    // Validate instructor ID format
    if (role === 'instructor' && !/^E-\d{2}-\d{3}$/.test(instructor_id)) {
      return res.status(400).json({ message: 'Instructor ID must be in format E-YY-XXX (e.g., E-24-001)' });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role
    };

    if (role === 'instructor') {
      userData.instructor_id = instructor_id;
    }

    if (role === 'student') {
      userData.student_id = student_id;
      userData.age = age;
      userData.gender = gender;
      userData.grade = grade;
      userData.center = center;
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        instructor_id: user.instructor_id,
        student_id: user.student_id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('center');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        instructor_id: user.instructor_id,
        student_id: user.student_id,
        center: user.center
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('center');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
