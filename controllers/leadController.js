// controllers/leadController.js
import Lead from '../models/Lead.js';
import axios from 'axios';

// GET /api/leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

// POST /api/leads
export const addLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ success: true, lead });
  } catch (err) {
    console.error('Error adding lead:', err);
    res.status(500).json({ error: 'Failed to add lead' });
  }
};

// PUT /api/leads/:id
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, lead });
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};

// GET /api/leads/stats
export const getLeadStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const qualified = await Lead.countDocuments({ status: 'qualified' });
    const whatsappSent = await Lead.countDocuments({ whatsappSent: true });
    res.json({ total, qualified, whatsappSent });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// POST /api/leads/upload
export const uploadLeads = async (req, res) => {
  try {
    const leads = req.body.leads;
    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ success: false, error: 'Invalid leads format' });
    }

    const insertedLeads = await Lead.insertMany(leads);

    // Optional: Send data to Make webhook
    if (process.env.MAKE_WEBHOOK_URL) {
      try {
        await axios.post(process.env.MAKE_WEBHOOK_URL, { leads: insertedLeads });
      } catch (hookErr) {
        console.warn('Make Webhook Error:', hookErr.message);
      }
    }

    res.status(200).json({ success: true, inserted: insertedLeads.length });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
