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

// GET /api/leads - fetch all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error('Get leads error:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// POST /api/leads - add single lead
router.post('/', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ success: true, lead: newLead });
  } catch (err) {
    console.error('Add lead error:', err);
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

// PUT /api/leads/:id - update lead
router.put('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('Update lead error:', err);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id - delete lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// GET /api/leads/stats - dashboard stats
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
