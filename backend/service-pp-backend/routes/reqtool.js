import express from 'express';
import ToolRequest from '../models/ToolRequest.js';
import Provider from '../models/Provider.js';

const router = express.Router();

// ---------------------
// Submit Tool Request
// ---------------------
router.post('/submit-request', async (req, res) => {
  try {
    const { email, item_name, description } = req.body;

    // Validation
    if (!email || !item_name || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, item name, and description are required' 
      });
    }

    // Check if provider exists
    const provider = await Provider.findOne({ email: email.toLowerCase().trim() });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Create tool request
    const toolRequest = new ToolRequest({
      email: email.toLowerCase().trim(),
      item_name: item_name.trim(),
      description: description.trim(),
      status: 'pending',
      offers: []
    });

    await toolRequest.save();

    console.log(`Tool request submitted by ${email}:`, {
      item_name,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Tool request submitted successfully',
      requestId: toolRequest._id
    });
  } catch (err) {
    console.error('Error submitting tool request:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ---------------------
// Get Tool Requests for a Provider
// ---------------------
router.get('/get-requests', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const requests = await ToolRequest.find({ email: email.toLowerCase().trim() })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests: requests
    });
  } catch (err) {
    console.error('Error fetching tool requests:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------
// Delete Tool Request
// ---------------------
router.post('/delete-request', async (req, res) => {
  try {
    const { email, requestId } = req.body;

    if (!email || !requestId) {
      return res.status(400).json({ success: false, message: 'Email and request ID required' });
    }

    const result = await ToolRequest.findOneAndDelete({ 
      _id: requestId, 
      email: email.toLowerCase().trim() 
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    console.log(`Tool request deleted: ${requestId}`);

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting tool request:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
