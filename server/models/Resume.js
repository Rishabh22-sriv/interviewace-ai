const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    resumePublicId: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    feedback: {
      missingSkills: [String],
      grammarIssues: [String],
      strengths: [String],
      weaknesses: [String],
      suggestedImprovements: [String],
      recommendedTechnologies: [String],
      recommendedProjects: [String],
      summary: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    analyzedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
