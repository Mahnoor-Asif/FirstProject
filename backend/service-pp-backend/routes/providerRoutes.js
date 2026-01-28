import express from 'express';
import multer from 'multer';
import path from 'path';
import Provider from '../models/Provider.js';

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // make sure "uploads" folder exists
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/* ================= SIGNUP ROUTE ================= */
router.post(
  '/signup',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 },
    { name: 'criminalClearance', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, email, contactNumber, cnicNumber } = req.body;

      // Validation
      if (!name || !email || !contactNumber || !cnicNumber) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      if (!req.files || !req.files.profilePhoto || !req.files.cnicFront || !req.files.cnicBack) {
        return res.status(400).json({
          success: false,
          message: 'All required files must be uploaded'
        });
      }

      // Check if email already exists
      const existingProvider = await Provider.findOne({ email });
      if (existingProvider) {
        return res.status(409).json({
          success: false,
          message: 'Account already exists'
        });
      }

      // Save provider
      const provider = new Provider({
        name,
        email,
        contactNumber,
        cnicNumber,
        profilePhoto: req.files.profilePhoto[0].filename,
        cnicFront: req.files.cnicFront[0].filename,
        cnicBack: req.files.cnicBack[0].filename,
        criminalClearance: req.files.criminalClearance ? req.files.criminalClearance[0].filename : null
      });

      await provider.save();

      res.status(201).json({
        success: true,
        message: 'Registration successful'
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

export default router;
