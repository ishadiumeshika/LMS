const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Check if user is instructor
const isInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Instructor only.' });
  }
  next();
};

// Check if user is student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Student only.' });
  }
  next();
};

module.exports = { auth, isAdmin, isInstructor, isStudent };
