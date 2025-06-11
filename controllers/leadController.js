// controllers/leadController.js
import Lead from '../models/Lead.js';

export const getAllLeads = async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
};

export const addLead = async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.status(201).json(lead);
};

export const updateLead = async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(lead);
};

export const deleteLead = async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: 'Lead deleted' });
};

export const getLeadStats = async (req, res) => {
  const total = await Lead.countDocuments();
  const qualified = await Lead.countDocuments({ status: 'qualified' });
  const whatsappSent = await Lead.countDocuments({ whatsappSent: true });
  res.json({ total, qualified, whatsappSent });
};
