// routes/leadRoutes.js
import express from 'express';
import Lead from '../models/Lead.js';
import axios from 'axios';
const router = express.Router();

// POST /upload CSV leads
router.post('/upload', async (req, res) => {
  try {
    const leads = req.body.leads;

    const insertedLeads = await Lead.insertMany(leads);

    // Send to Make webhook for WhatsApp follow-up
    await axios.post(process.env.MAKE_WEBHOOK_URL, {
      leads: insertedLeads,
    });

    res.status(200).json({ success: true, inserted: insertedLeads.length });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
