import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import reqtoolRoutes from './routes/reqtool.js';
//import skillsRoutes from './routes/skills.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5004;

// 1️⃣ Create uploads folder if missing
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 2️⃣ DB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/serviceProviderDB")
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB Connection error:', err));

// 3️⃣ Middleware
app.use(cors());

// Only parse JSON for non-multipart requests
app.use(express.json({ 
  limit: '50mb'
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadDir));
//app.use('/api', skillsRoutes);

// 4️⃣ Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// 5️⃣ Test Route
app.get('/', (req, res) => res.send('Backend Running 🚀'));

// 6️⃣ Routes (multer is handled inside authRoutes)
app.use('/api', authRoutes);
app.use('/api/reqtool', reqtoolRoutes);

// Error handling middleware for multer
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large' });
  }
  if (err.code === 'LIMIT_PART_COUNT') {
    return res.status(400).json({ success: false, message: 'Too many files' });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Server error: ' + err.message });
});

// 7️⃣ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
