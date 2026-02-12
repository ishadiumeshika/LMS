const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],
    required: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  // For Instructor
  instructor_id: {
    type: String,
    sparse: true,
    unique: true,
    // Format: E-YY-XXX (e.g., E-24-001)
    validate: {
      validator: function(v) {
        if (this.role === 'instructor') {
          return /^E-\d{2}-\d{3}$/.test(v);
        }
        return true;
      },
      message: 'Instructor ID must be in format E-YY-XXX'
    }
  },
  // For Student
  student_id: {
    type: String,
    sparse: true,
    unique: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['M', 'F', 'Other']
  },
  grade: {
    type: String
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center'
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Validate instructor email domain
UserSchema.pre('validate', function(next) {
  if (this.role === 'instructor') {
    // Email must be like heshan@eng.pdn.ac.lk
    if (!this.email.endsWith('@eng.pdn.ac.lk')) {
      this.invalidate('email', 'Instructor email must be from @eng.pdn.ac.lk domain');
    }
    if (!this.instructor_id) {
      this.invalidate('instructor_id', 'Instructor ID is required for instructors');
    }
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
