const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    badges: [{ type: String }],
    interviewsCompleted: { type: Number, default: 0 },
    resumesAnalyzed: { type: Number, default: 0 },
    dsaProblems: { type: Number, default: 0 },
    codingProblems: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProgress', userProgressSchema);
