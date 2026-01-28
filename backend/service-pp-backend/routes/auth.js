import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import path from 'path';
import Provider from '../models/Provider.js';
import Help from '../models/Help.js';
import FAQ from '../models/FAQ.js';

const router = express.Router();

// ---------------------
// Multer Setup for File Uploads
// ---------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname))
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 4,
    fields: 10
  }
});

// Configure upload fields
const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'cnicFront', maxCount: 1 },
  { name: 'cnicBack', maxCount: 1 },
  { name: 'criminalClearance', maxCount: 1 }
]);

// Wrapper for multer error handling
const uploadWithErrorHandling = (req, res, next) => {
  console.log('📨 Incoming request to /signup');
  console.log('  Content-Type:', req.headers['content-type']);
  console.log('  Content-Length:', req.headers['content-length']);
  
  uploadFields(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      console.error('   Stack:', err.stack?.split('\n').slice(0, 3).join(' '));
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ success: false, message: 'Too many files' });
      }
      return res.status(400).json({ success: false, message: 'Upload error: ' + err.message });
    }
    next();
  });
};

// ---------------------
// Signup Route with Error Handler
// ---------------------
router.post('/signup', uploadWithErrorHandling, async (req, res) => {
  try {
    const { name, email, contactNumber, cnicNumber, password } = req.body;
    const files = req.files;

    console.log('--- New Signup Request ---');
    console.log('Body fields:', { name, email, contactNumber, cnicNumber, password: password ? 'provided' : 'missing' });
    console.log('Files received:', files ? Object.keys(files) : 'none');
    if (files) {
      Object.keys(files).forEach(key => {
        console.log(`  ${key}: ${files[key][0].size} bytes - ${files[key][0].filename}`);
      });
    }

    //  Validate text fields
    if (!name || !email || !contactNumber || !cnicNumber || !password) {
      console.error(' Missing required fields:', { name: !!name, email: !!email, contactNumber: !!contactNumber, cnicNumber: !!cnicNumber, password: !!password });
      return res.status(400).json({ success: false, message: 'All text fields are required' });
    }

    //  Validate required images
    if (!files || !files.profilePhoto || !files.cnicFront || !files.cnicBack) {
      console.error(' Missing required images. Files received:', files ? Object.keys(files) : 'none');
      return res.status(400).json({ success: false, message: 'Profile photo, CNIC front/back are required' });
    }

    //  Check duplicate email
    const existing = await Provider.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.error(' Email already registered:', email);
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    //  Hash password and create Provider
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Safely extract file paths
      const profilePhotoPath = files.profilePhoto && files.profilePhoto[0] ? (files.profilePhoto[0].path || files.profilePhoto[0].filename) : '';
      const cnicFrontPath = files.cnicFront && files.cnicFront[0] ? (files.cnicFront[0].path || files.cnicFront[0].filename) : '';
      const cnicBackPath = files.cnicBack && files.cnicBack[0] ? (files.cnicBack[0].path || files.cnicBack[0].filename) : '';
      const criminalClearancePath = files.criminalClearance && files.criminalClearance[0] ? (files.criminalClearance[0].path || files.criminalClearance[0].filename) : '';

      console.log('File paths extracted:', { profilePhotoPath, cnicFrontPath, cnicBackPath, criminalClearancePath });

      const newProvider = new Provider({
        name,
        email: email.toLowerCase().trim(),
        contactNumber,
        cnicNumber,
        password: hashed,
        profilePhoto: profilePhotoPath,
        cnicFront: cnicFrontPath,
        cnicBack: cnicBackPath,
        criminalClearance: criminalClearancePath,
        skills: {} // Initialize empty skills object
      });

      await newProvider.save();

      console.log('Provider saved:', newProvider._id);

      res.status(201).json({
        success: true,
        message: 'Signup successful',
        providerId: newProvider._id,
        email: newProvider.email
      });
    } catch (hashErr) {
      console.error(' Error during password hashing or save:', hashErr.message);
      console.error(' Error stack:', hashErr.stack);
      return res.status(500).json({ success: false, message: 'Error creating account: ' + hashErr.message });
    }
  } catch (err) {
    console.error('SERVER ERROR :', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
  }
});

// ---------------------
// Update Skills Route
// ---------------------
router.post('/update-skills', async (req, res) => {
  try {
    const { email, skills } = req.body;

    if (!email || !skills) {
      return res.status(400).json({ success: false, message: 'Email and skills are required' });
    }

    // Find provider by email
    const provider = await Provider.findOne({ email });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Transform skills array to object format for easier display
    // Input: [{category: 'Electrical', subcategories: ['Wiring', 'Lights']}, ...]
    // Output: {Electrical: ['Wiring', 'Lights'], ...}
    const skillsObject = {};
    if (Array.isArray(skills)) {
      skills.forEach(skill => {
        if (skill.category && skill.subcategories) {
          skillsObject[skill.category] = skill.subcategories;
        }
      });
    } else {
      // If already an object, use as is
      Object.assign(skillsObject, skills);
    }

    // Update skills
    provider.skills = skillsObject;
    await provider.save();

    console.log(` Skills updated for ${email}:`, skillsObject);

    res.status(200).json({ success: true, message: 'Skills updated successfully' });

  } catch (err) {
    console.error('Error updating skills:', err);
    res.status(500).json({ success: false, message: 'Server error while updating skills' });
  }
});

// ---------------------
// Login Route
// ---------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ success: false, message: "Invalid password" });

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------------
// Upload Certifications Route
// ---------------------
router.post('/update-certifications', upload.array('certifications', 6), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const provider = await Provider.findOne({ email });
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    const files = req.files || [];
    const filenames = files.map(f => f.path || f.filename);

    // Append or set certifications
    provider.certifications = provider.certifications ? provider.certifications.concat(filenames) : filenames;
    await provider.save();

    res.status(200).json({ success: true, message: 'Certifications uploaded' });
  } catch (err) {
    console.error('Error uploading certifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------
// Finalize Registration
// ---------------------
router.post('/finalize-registration', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const provider = await Provider.findOne({ email });
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    provider.isComplete = true;
    await provider.save();

    res.status(200).json({ success: true, message: 'Registration completed' });
  } catch (err) {
    console.error('Error finalizing registration:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------
// Get Provider Profile Data
// ---------------------
router.get('/get-provider', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const provider = await Provider.findOne({ email: email.toLowerCase().trim() });
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    res.status(200).json({ 
      success: true, 
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        contactNumber: provider.contactNumber,
        skills: provider.skills || {},
        certifications: provider.certifications || [],
        profilePhoto: provider.profilePhoto
      }
    });
  } catch (err) {
    console.error('Error fetching provider:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------
// DEVELOPMENT: Reset Database
// ---------------------
router.post('/dev/reset-database', async (req, res) => {
  try {
    const deletedCount = await Provider.deleteMany({});
    console.log(` Database reset - Deleted ${deletedCount.deletedCount} providers`);
    res.status(200).json({ 
      success: true, 
      message: 'Database reset successfully', 
      deletedCount: deletedCount.deletedCount 
    });
  } catch (err) {
    console.error('Error resetting database:', err);
    res.status(500).json({ success: false, message: 'Error resetting database: ' + err.message });
  }
});

// ---------------------
// Submit Help/Support Request
// ---------------------
router.post('/submit-help-request', async (req, res) => {
  try {
    const { email, subject, reason, explanation, timestamp } = req.body;

    // Validation
    if (!email || !subject || !reason || !explanation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, subject, reason, and explanation are required' 
      });
    }

    // Check if provider exists
    const provider = await Provider.findOne({ email: email.toLowerCase().trim() });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Create help request
    const helpRequest = new Help({
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      reason: reason,
      explanation: explanation.trim(),
      status: 'open',
      createdAt: timestamp || new Date()
    });

    await helpRequest.save();

    console.log(` Help request submitted by ${email}:`, {
      subject,
      reason,
      status: 'open'
    });

    res.status(201).json({
      success: true,
      message: 'Help request submitted successfully',
      requestId: helpRequest._id
    });
  } catch (err) {
    console.error('Error submitting help request:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ---------------------
// Get Help Requests for a Provider
// ---------------------
router.get('/get-help-requests', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const requests = await Help.find({ email: email.toLowerCase().trim() })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests: requests
    });
  } catch (err) {
    console.error('Error fetching help requests:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------
// Submit FAQ Question
// ---------------------
router.post('/submit-faq-question', async (req, res) => {
  try {
    const { email, subject, question } = req.body;

    // Validation
    if (!email || !subject || !question) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, subject, and question are required' 
      });
    }

    // Check if provider exists
    const provider = await Provider.findOne({ email: email.toLowerCase().trim() });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Create FAQ question
    const faqQuestion = new FAQ({
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      question: question.trim(),
      status: 'pending',
      createdAt: new Date()
    });

    await faqQuestion.save();

    console.log(` FAQ question submitted by ${email}:`, {
      subject,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Question submitted successfully',
      questionId: faqQuestion._id
    });
  } catch (err) {
    console.error('Error submitting FAQ question:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ---------------------
// Get User's FAQ Questions
// ---------------------
router.get('/get-faq-questions', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const questions = await FAQ.find({ email: email.toLowerCase().trim() })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      questions: questions
    });
  } catch (err) {
    console.error('Error fetching FAQ questions:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------
// Update User Location
// ---------------------
router.post('/update-location', async (req, res) => {
  try {
    const { email, location } = req.body;

    if (!email || !location) {
      return res.status(400).json({ success: false, message: 'Email and location are required' });
    }

    const provider = await Provider.findOne({ email: email.toLowerCase().trim() });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.location = location.trim();
    await provider.save();

    console.log(` Location updated for ${email}: ${location}`);

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      location: provider.location
    });
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    const inputEmail = req.body.email?.toLowerCase().trim();
    if (!inputEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const provider = await Provider.findOne({ email: inputEmail });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const dbEmail = provider.email; // ✅ email from DB only

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    provider.otp = otp;
    provider.otpExpiry = Date.now() + 10 * 60 * 1000;
    provider.otpVerified = false;
    await provider.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nexora Support" <${process.env.GMAIL_USER}>`,
      to: dbEmail,
      subject: 'Your OTP Code',
      html: `
        <h2>Account Verification</h2>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    console.log('✅ OTP sent to:', dbEmail);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/send-otp', async (req, res, next) => {
  try {
    console.log('Request body:', req.body);

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate OTP
    const otpCode = generateOTP();
    console.log('Generated OTP:', otpCode);

    // Optional: Save OTP to database
    if (mongoose.connection.readyState === 1) { // ensure DB connected
      await OTP.create({ email, code: otpCode, createdAt: new Date() });
      console.log('OTP saved to DB for:', email);
    }

    // Optional: Send OTP via email (example using nodemailer)
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otpCode}`
    });
    console.log('OTP email sent to:', email);
    */

    return res.json({ success: true, message: 'OTP sent successfully', otp: otpCode }); // remove otp in production

  } catch (err) {
    console.error('Error in /send-otp:', err);
    next(err); // pass to your existing error middleware
  }
});
router.post('/verify-otp', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }

    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    if (!provider.otp || provider.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (provider.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    provider.otp = null;
    provider.otpExpiry = null;
    provider.otpVerified = true;
    await provider.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/change-password', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    if (!provider.otpVerified) {
      return res.status(401).json({ message: 'Verify OTP first' });
    }

    provider.password = await bcrypt.hash(newPassword, 10);
    provider.otpVerified = false;
    await provider.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;