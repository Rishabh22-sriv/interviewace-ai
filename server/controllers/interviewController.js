const Interview = require('../models/Interview');
const User = require('../models/User');
const { generateInterviewQuestions, evaluateAnswer, generateInterviewSummary } = require('../services/geminiService');

// @desc    Start a new interview
// @route   POST /api/interview/start
const startInterview = async (req, res, next) => {
  try {
    const { type, difficulty, totalQuestions, topic } = req.body;

    // Generate questions using Gemini
    const generatedQuestions = await generateInterviewQuestions({
      type,
      difficulty,
      totalQuestions: parseInt(totalQuestions),
      topic,
    });

    const questions = generatedQuestions.map((q) => ({
      question: q.question,
      answer: '',
      isEvaluated: false,
    }));

    const interview = await Interview.create({
      userId: req.user.id,
      type,
      difficulty,
      topic: topic || 'General',
      totalQuestions: parseInt(totalQuestions),
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
        totalQuestions: interview.totalQuestions,
        questions: interview.questions.map((q, i) => ({
          id: q._id,
          index: i,
          question: q.question,
        })),
        status: interview.status,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answer for a question
// @route   POST /api/interview/answer
const submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionIndex, answer, inputMethod } = req.body;

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

    // Evaluate the answer using Gemini AI
    const evaluation = await evaluateAnswer({
      question: question.question,
      answer,
      type: interview.type,
      difficulty: interview.difficulty,
    });

    // Update the question with answer and evaluation
    interview.questions[questionIndex].answer = answer;
    interview.questions[questionIndex].scores = {
      communication: evaluation.scores.communication,
      technicalAccuracy: evaluation.scores.technicalAccuracy,
      confidence: evaluation.scores.confidence,
      grammar: evaluation.scores.grammar,
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

    // Update user stats
    const allInterviews = await Interview.find({ userId: req.user.id, status: 'completed' });
    const avgScore = Math.round(
      allInterviews.reduce((sum, i) => sum + i.overallScores.overall, 0) / allInterviews.length
    );

    await User.findByIdAndUpdate(req.user.id, {
      totalInterviews: allInterviews.length,
      averageScore: avgScore,
    });

    // Generate AI summary
    let summary = null;
    try {
      summary = await generateInterviewSummary(interview);
    } catch (e) {
      console.error('Summary generation failed:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Interview completed successfully',
      overallScores: interview.overallScores,
      summary,
    });
  } catch (error) {
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
      .select('-questions.answer -questions.feedback');

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
