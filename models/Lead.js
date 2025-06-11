// models/Lead.js
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    source: { type: String, default: 'csv' },
    status: { type: String, default: 'pending' },
    budget: String,
    lookingFor: String,
    whatsappSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
