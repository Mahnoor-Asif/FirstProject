const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  cnicNumber: { type: String, required: true },
  profilePhoto: { type: String },
  cnicFront: { type: String },
  cnicBack: { type: String },
  criminalClearance: { type: String },
  // This is where skills are stored as an array of objects
  skills: [{
    category: { type: String },
    subcategories: [{ type: String }]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);