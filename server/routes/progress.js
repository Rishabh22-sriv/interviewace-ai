const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');

// XP thresholds per level (level = index + 1)
const XP_PER_LEVEL = 500;

const calculateLevel = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

// @route   GET /api/progress
// @desc    Get user's XP, level, streak, and badges
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ user: req.user._id });

    // Auto-create progress document if it doesn't exist yet
    if (!progress) {
      progress = await UserProgress.create({ user: req.user._id });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/progress/leaderboard
// @desc    Get top 10 users by XP
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaderboard = await UserProgress.find()
      .sort({ xp: -1 })
      .limit(10)
      .populate('user', 'name profilePicture');

    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user._id,
      name: entry.user.name,
      profilePicture: entry.user.profilePicture,
      xp: entry.xp,
      level: entry.level,
      streak: entry.streak,
      badges: entry.badges,
    }));

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/progress/add-xp
// @desc    Add XP points for a given action
// @access  Private
router.post('/add-xp', protect, async (req, res) => {
  try {
    const { action, amount } = req.body;

    if (!action || amount === undefined) {
      return res.status(400).json({ success: false, message: 'action and amount are required' });
    }

    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ success: false, message: 'amount must be a non-negative number' });
    }

    let progress = await UserProgress.findOne({ user: req.user._id });

    if (!progress) {
      progress = await UserProgress.create({ user: req.user._id });
    }

    const prevLevel = progress.level;

    progress.xp += amount;
    progress.totalScore += amount;
    progress.level = calculateLevel(progress.xp);

    // Update activity-specific counters
    switch (action) {
      case 'interview_completed':
        progress.interviewsCompleted += 1;
        break;
      case 'resume_analyzed':
        progress.resumesAnalyzed += 1;
        break;
      case 'dsa_solved':
        progress.dsaProblems += 1;
        break;
      case 'coding_solved':
        progress.codingProblems += 1;
        break;
      default:
        break;
    }

    // Streak logic: check if last activity was yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (progress.lastActiveDate) {
      const lastActive = new Date(progress.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      if (lastActive.getTime() === yesterday.getTime()) {
        // Continued streak
        progress.streak += 1;
      } else if (lastActive.getTime() < yesterday.getTime()) {
        // Streak broken
        progress.streak = 1;
      }
      // If same day, streak stays the same
    } else {
      progress.streak = 1;
    }

    if (progress.streak > progress.longestStreak) {
      progress.longestStreak = progress.streak;
    }

    progress.lastActiveDate = new Date();

    await progress.save();

    const leveledUp = progress.level > prevLevel;

    res.status(200).json({
      success: true,
      data: {
        xp: progress.xp,
        level: progress.level,
        streak: progress.streak,
        longestStreak: progress.longestStreak,
        badges: progress.badges,
        leveledUp,
        xpAdded: amount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
