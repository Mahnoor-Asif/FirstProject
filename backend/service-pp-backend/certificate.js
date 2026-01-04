import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/signup', upload.array('certificates[]'), async (req, res) => {
  try {
    console.log('Files:', req.files);  // All uploaded certificates
    console.log('Body:', req.body);    // Registration fields + skills
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
