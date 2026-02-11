const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true,
    match: /^E-\d{2}-\d{3}$/,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /@eng\.pdn\.ac\.lk$/,
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Instructor', instructorSchema);
