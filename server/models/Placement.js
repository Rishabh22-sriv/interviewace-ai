const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    package: { type: String, default: '' },
    location: { type: String, default: '' },
    applicationDate: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'pending'],
      default: 'applied',
    },
    notes: { type: String, default: '' },
    jobUrl: { type: String, default: '' },
    round: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Placement', placementSchema);
