const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  audioUrl: { type: String, default: '' },
  scores: {
    communication: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    sampleAnswer: { type: String, default: '' },
  },
  isEvaluated: { type: Boolean, default: false },
  answeredAt: Date,
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['hr', 'technical', 'aptitude', 'system-design', 'behavioral'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    topic: {
      type: String,
      default: 'General',
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    questions: [questionSchema],
    overallScores: {
      communication: { type: Number, default: 0 },
      technicalAccuracy: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      grammar: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'abandoned'],
      default: 'pending',
    },
    completedAt: Date,
    duration: { type: Number, default: 0 }, // in seconds
    inputMethod: {
      type: String,
      enum: ['text', 'voice', 'mixed'],
      default: 'text',
    },
  },
  { timestamps: true }
);

// Calculate overall scores after interview completion
interviewSchema.methods.calculateOverallScores = function () {
  const evaluatedQuestions = this.questions.filter((q) => q.isEvaluated);
  if (evaluatedQuestions.length === 0) return;

  const totals = evaluatedQuestions.reduce(
    (acc, q) => {
      acc.communication += q.scores.communication;
      acc.technicalAccuracy += q.scores.technicalAccuracy;
      acc.confidence += q.scores.confidence;
      acc.grammar += q.scores.grammar;
      return acc;
    },
    { communication: 0, technicalAccuracy: 0, confidence: 0, grammar: 0 }
  );

  const count = evaluatedQuestions.length;
  this.overallScores.communication = Math.round(totals.communication / count);
  this.overallScores.technicalAccuracy = Math.round(totals.technicalAccuracy / count);
  this.overallScores.confidence = Math.round(totals.confidence / count);
  this.overallScores.grammar = Math.round(totals.grammar / count);
  this.overallScores.overall = Math.round(
    (this.overallScores.communication +
      this.overallScores.technicalAccuracy +
      this.overallScores.confidence +
      this.overallScores.grammar) /
      4
  );
};

module.exports = mongoose.model('Interview', interviewSchema);
