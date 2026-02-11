const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true,
    match: /^E-\d{2}-\d{3}$/  // Format: E-YY-001
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@eng\.pdn\.ac\.lk$/  // Only eng.pdn.ac.lk emails
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Instructor', instructorSchema);
