const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'center', 'instructor', 'student'],
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['Center', 'Instructor', 'Student']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
