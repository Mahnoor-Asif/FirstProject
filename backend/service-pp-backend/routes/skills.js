import express from 'express';
import Provider from '../models/Provider.js';

const router = express.Router();

/**
 * Add or update skills for a provider
 * POST /api/skills/:providerId
 * Body example:
 * {
 *   "skills": [
 *     { "category": "Web Development", "subcategories": ["React", "Node.js"] },
 *     { "category": "Design", "subcategories": ["Figma", "Adobe XD"] }
 *   ]
 * }
 */
router.post('/skills/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array'
      });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // Save skills
    provider.skills = skills;
    await provider.save();

    console.log(`Skills updated for ${providerId}:`, skills);

    res.status(200).json({
      success: true,
      message: 'Skills updated successfully',
      skills: provider.skills
    });

  } catch (err) {
    console.error('SKILLS ERROR :', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
