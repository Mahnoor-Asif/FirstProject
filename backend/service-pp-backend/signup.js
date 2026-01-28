import express from 'express';
import multer from 'multer';
import path from 'path';
import Provider from './models/Provider.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Signup route
router.post('/signup', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'cnicFront', maxCount: 1 },
  { name: 'cnicBack', maxCount: 1 },
  { name: 'criminalClearance', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, email, contactNumber, cnicNumber, password } = req.body;

    // Validate required fields
    if (!name || !email || !contactNumber || !cnicNumber || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if account already exists
    const existing = await Provider.findOne({ email });
    if(existing) {
      return res.status(400).json({ success: false, message: 'Account already exists' });
    }

    // Save new provider
    const newProvider = new Provider({
      name,
      email,
      contactNumber,
      cnicNumber,
      password,
      profilePhoto: req.files.profilePhoto ? req.files.profilePhoto[0].path : '',
      cnicFront: req.files.cnicFront ? req.files.cnicFront[0].path : '',
      cnicBack: req.files.cnicBack ? req.files.cnicBack[0].path : '',
      criminalClearance: req.files.criminalClearance ? req.files.criminalClearance[0].path : ''
    });

    await newProvider.save();
    res.json({ 
      success: true, 
      message: 'Provider registered successfully',
      providerId: newProvider._id,
      email: newProvider.email
    });
  } catch(err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

export default router;
