const Interview = require('../models/Interview');
const User = require('../models/User');
const { generateInterviewQuestions, evaluateAnswer, generateInterviewSummary } = require('../services/geminiService');

// ─────────────────────────────────────────────
// INPUT VALIDATION
// ─────────────────────────────────────────────

const VALID_TYPES = ['hr', 'technical', 'behavioral', 'aptitude', 'system-design'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

const validateInterviewInput = (body) => {
  const { type, difficulty, totalQuestions, topic } = body;
  
  const errors = [];
  
  if (!type || !VALID_TYPES.includes(type.toLowerCase())) {
    errors.push(`Invalid interview type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  
  if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty.toLowerCase())) {
    errors.push(`Invalid difficulty. Must be: easy, medium, or hard`);
  }
  
  const numQ = parseInt(totalQuestions);
  if (!numQ || numQ < 1 || numQ > 20) {
    errors.push('Number of questions must be between 1 and 20');
  }
  
  // For technical interviews, topic is strongly recommended
  if (type === 'technical' && (!topic || topic.trim().length < 2)) {
    errors.push('A specific topic is required for Technical interviews (e.g., "HTML", "JavaScript", "Python")');
  }
  
  return errors;
};

// @desc    Start a new interview
// @route   POST /api/interview/start
const startInterview = async (req, res, next) => {
  try {
    const { type, difficulty, totalQuestions, topic, targetRole } = req.body;

    // Validate inputs
    const validationErrors = validateInterviewInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: validationErrors[0], 
        errors: validationErrors 
      });
    }

    // Normalize context
    const ctx = {
      type: type.toLowerCase().trim(),
      difficulty: difficulty.toLowerCase().trim(),
      totalQuestions: parseInt(totalQuestions),
      topic: topic ? topic.trim() : '',
      targetRole: targetRole || '',
    };

    console.log(`[Interview] Starting: type=${ctx.type}, topic=${ctx.topic}, difficulty=${ctx.difficulty}, questions=${ctx.totalQuestions}`);

    // Generate questions — context is passed in full, never dropped
    let generatedQuestions;
    try {
      generatedQuestions = await generateInterviewQuestions(ctx);
    } catch (aiError) {
      console.error('[Interview] AI question generation failed:', aiError.message);
      return res.status(503).json({
        success: false,
        message: aiError.message || 'AI service temporarily unavailable. Please try again.',
      });
    }

    if (!generatedQuestions || generatedQuestions.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Failed to generate interview questions. Please try again.',
      });
    }

    const questions = generatedQuestions.map((q) => ({
      question: q.question,
      skill: q.skill || ctx.topic || ctx.type,
      hint: q.hint || '',
      expectedConcepts: q.expectedConcepts || [],
      answer: '',
      isEvaluated: false,
    }));

    const interview = await Interview.create({
      userId: req.user.id,
      type: ctx.type,
      difficulty: ctx.difficulty,
      topic: ctx.topic || 'General',
      targetRole: ctx.targetRole,
      totalQuestions: ctx.totalQuestions,
      questions,
      status: 'in-progress',
    });

    res.status(201).json({
      success: true,
      interview: {
        id: interview._id,
        type: interview.type,
        difficulty: interview.difficulty,
        topic: interview.topic,
        targetRole: interview.targetRole,
        totalQuestions: interview.totalQuestions,
        questions: interview.questions.map((q, i) => ({
          id: q._id,
          index: i,
          question: q.question,
          hint: q.hint,
          // Don't expose expectedConcepts to frontend (cheat prevention)
        })),
        status: interview.status,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    console.error('[Interview] startInterview error:', error);
    next(error);
  }
};

// @desc    Submit answer for a question
// @route   POST /api/interview/answer
const submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionIndex, answer, inputMethod } = req.body;

    if (!interviewId || questionIndex === undefined || !answer) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user.id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Interview already completed' });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    console.log(`[Interview] Evaluating answer for Q${questionIndex}: "${question.question.slice(0, 50)}..."`);

    // Evaluate — pass full context including skill and expected concepts
    let evaluation;
    try {
      evaluation = await evaluateAnswer({
        question: question.question,
        answer: answer.trim(),
        type: interview.type,
        difficulty: interview.difficulty,
        topic: interview.topic,
        skill: question.skill || interview.topic,
        expectedConcepts: question.expectedConcepts || [],
      });
    } catch (aiError) {
      console.error('[Interview] Evaluation failed:', aiError.message);
      return res.status(503).json({
        success: false,
        message: 'Unable to evaluate answer at this time. Please try again.',
      });
    }

    // Store answer and evaluation
    interview.questions[questionIndex].answer = answer.trim();
    interview.questions[questionIndex].scores = {
      communication: evaluation.scores.communication,
      technicalAccuracy: evaluation.scores.technicalAccuracy,
      confidence: evaluation.scores.relevance, // backward compat
      grammar: evaluation.scores.completeness, // backward compat
      relevance: evaluation.scores.relevance,
      completeness: evaluation.scores.completeness,
      overall: evaluation.scores.overall,
    };
    interview.questions[questionIndex].feedback = evaluation.feedback;
    interview.questions[questionIndex].isEvaluated = true;
    interview.questions[questionIndex].answeredAt = new Date();

    if (inputMethod) interview.inputMethod = inputMethod;

    await interview.save();

    res.status(200).json({
      success: true,
      evaluation: {
        scores: evaluation.scores,
        feedback: evaluation.feedback,
      },
    });
  } catch (error) {
    console.error('[Interview] submitAnswer error:', error);
    next(error);
  }
};

// @desc    Complete an interview
// @route   POST /api/interview/complete/:id
const completeInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    interview.calculateOverallScores();
    interview.status = 'completed';
    interview.completedAt = new Date();

    if (req.body.duration) {
      interview.duration = req.body.duration;
    }

    await interview.save();

    // Update user stats (real data only)
    const allInterviews = await Interview.find({ userId: req.user.id, status: 'completed' });
    const avgScore = allInterviews.length > 0
      ? Math.round(allInterviews.reduce((sum, i) => sum + (i.overallScores?.overall || 0), 0) / allInterviews.length)
      : 0;

    await User.findByIdAndUpdate(req.user.id, {
      totalInterviews: allInterviews.length,
      averageScore: avgScore,
    });

    // Generate summary (optional — failure is non-blocking)
    let summary = null;
    try {
      summary = await generateInterviewSummary(interview);
    } catch (e) {
      console.error('[Interview] Summary generation failed (non-blocking):', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Interview completed successfully',
      overallScores: interview.overallScores,
      summary,
    });
  } catch (error) {
    console.error('[Interview] completeInterview error:', error);
    next(error);
  }
};

// @desc    Get interview history
// @route   GET /api/interview/history
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Interview.countDocuments({ userId: req.user.id });
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-questions.answer -questions.feedback -questions.expectedConcepts');

    res.status(200).json({
      success: true,
      interviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview report
// @route   GET /api/interview/report/:id
const getReport = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an interview
// @route   DELETE /api/interview/:id
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.status(200).json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { startInterview, submitAnswer, completeInterview, getHistory, getReport, deleteInterview };
