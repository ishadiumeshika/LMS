const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Instructor = require('../models/Instructor');
const Student = require('../models/Student');
const Center = require('../models/Center');

// Register Instructor (Email validation for eng.pdn.ac.lk)
router.post('/register/instructor', async (req, res) => {
  try {
    const { universityId, name, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@eng\.pdn\.ac\.lk$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Only eng.pdn.ac.lk email addresses are allowed for instructors' 
      });
    }

    // Check if instructor already exists
    const existingInstructor = await Instructor.findOne({ 
      $or: [{ universityId }, { email }] 
    });
    if (existingInstructor) {
      return res.status(400).json({ message: 'Instructor already exists' });
    }

    // Create instructor
    const instructor = new Instructor({
      universityId,
      name,
      email
    });
    await instructor.save();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const user = new User({
      username: email,
      password: hashedPassword,
      role: 'instructor',
      email: email,
      referenceId: instructor._id,
      referenceModel: 'Instructor'
    });
    await user.save();

    res.status(201).json({ 
      message: 'Instructor registered successfully',
      instructor: {
        id: instructor._id,
        universityId: instructor.universityId,
        name: instructor.name,
        email: instructor.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Get reference data based on role
    let userData = { role: user.role, username: user.username };
    
    if (user.referenceId) {
      if (user.referenceModel === 'Instructor') {
        const instructor = await Instructor.findById(user.referenceId);
        userData.profile = instructor;
      } else if (user.referenceModel === 'Student') {
        const student = await Student.findById(user.referenceId).populate('centerId');
        userData.profile = student;
      } else if (user.referenceModel === 'Center') {
        const center = await Center.findById(user.referenceId);
        userData.profile = center;
      }
    }

    res.json({
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let userData = { role: user.role, username: user.username };
    
    if (user.referenceId) {
      if (user.referenceModel === 'Instructor') {
        const instructor = await Instructor.findById(user.referenceId);
        userData.profile = instructor;
      } else if (user.referenceModel === 'Student') {
        const student = await Student.findById(user.referenceId).populate('centerId');
        userData.profile = student;
      } else if (user.referenceModel === 'Center') {
        const center = await Center.findById(user.referenceId);
        userData.profile = center;
      }
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
