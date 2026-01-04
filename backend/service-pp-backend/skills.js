// skills.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// --- Skill Schema ---
const SkillSchema = new mongoose.Schema({
  skills: [
    {
      category: { type: String, required: true },
      subcategories: { type: [String], required: true }
    }
  ]
}, { timestamps: true });

const Skill = mongoose.model('Skill', SkillSchema);

// --- Routes ---

// Save skills
router.post('/save-skills', async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || skills.length === 0) {
      return res.status(400).json({ success: false, message: 'Select at least one skill' });
    }

    const newSkills = new Skill({ skills });
    await newSkills.save();

    res.json({ success: true, message: 'Skills saved successfully' });
  } catch (err) {
    console.error('Error saving skills:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all saved skills (optional)
router.get('/get-skills', async (req, res) => {
  try {
    const allSkills = await Skill.find();
    res.json({ success: true, data: allSkills });
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
