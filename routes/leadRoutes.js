// routes/leadRoutes.js
import express from 'express';
import Lead from '../models/Lead.js';
import axios from 'axios';

const router = express.Router();

// POST /api/leads/upload
router.post('/upload', async (req, res) => {
  try {
    const leads = req.body.leads;
    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ success: false, error: 'Invalid leads format' });
    }

    const insertedLeads = await Lead.insertMany(leads);

    // Send to Make webhook
    await axios.post(process.env.MAKE_WEBHOOK_URL, {
      leads: insertedLeads,
    });

    res.status(200).json({ success: true, inserted: insertedLeads.length });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Optional: GET /api/leads/stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const qualified = await Lead.countDocuments({ status: 'qualified' });
    const whatsappSent = await Lead.countDocuments({ whatsappSent: true });

    res.status(200).json({ total, qualified, whatsappSent });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
