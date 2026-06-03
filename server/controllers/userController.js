const User = require('../models/User');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const cloudinary = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/user/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Get stats
    const totalInterviews = await Interview.countDocuments({
      userId: req.user.id,
      status: 'completed',
    });

    const interviews = await Interview.find({ userId: req.user.id, status: 'completed' }).select(
      'overallScores createdAt'
    );

    const avgScore =
      interviews.length > 0
        ? Math.round(
            interviews.reduce((sum, i) => sum + i.overallScores.overall, 0) / interviews.length
          )
        : 0;

    const latestResume = await Resume.findOne({ userId: req.user.id, status: 'completed' })
      .sort({ createdAt: -1 })
      .select('atsScore');

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      stats: {
        totalInterviews,
        averageScore: avgScore,
        resumeScore: latestResume?.atsScore || 0,
        improvementRate:
          interviews.length >= 2
            ? Math.max(
                0,
                interviews[interviews.length - 1].overallScores.overall -
                  interviews[0].overallScores.overall
              )
            : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/user/password
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   POST /api/user/profile-picture
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const user = await User.findById(req.user.id);

    // Delete old profile picture from Cloudinary
    if (user.profilePicturePublicId) {
      await cloudinary.uploader.destroy(user.profilePicturePublicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'interviewace/profiles',
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      format: 'jpg',
    });

    user.profilePicture = result.secure_url;
    user.profilePicturePublicId = result.public_id;
    await user.save();

    res.status(200).json({
      success: true,
      profilePicture: result.secure_url,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/user/account
const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Soft delete
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.cookie('token', 'none', { expires: new Date(Date.now() + 5000), httpOnly: true });
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user analytics data
// @route   GET /api/user/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const interviews = await Interview.find({
      userId: req.user.id,
      status: 'completed',
    })
      .sort({ createdAt: 1 })
      .select('overallScores type createdAt');

    // Weekly performance (last 7 weeks)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - i * 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      const weekInterviews = interviews.filter(
        (int) => new Date(int.createdAt) >= startDate && new Date(int.createdAt) < endDate
      );

      weeklyData.push({
        week: `Week ${7 - i}`,
        score:
          weekInterviews.length > 0
            ? Math.round(
                weekInterviews.reduce((sum, i) => sum + i.overallScores.overall, 0) /
                  weekInterviews.length
              )
            : 0,
        count: weekInterviews.length,
      });
    }

    // Skills growth
    const skillsData = interviews.map((int, index) => ({
      interview: index + 1,
      communication: int.overallScores.communication,
      technical: int.overallScores.technicalAccuracy,
      confidence: int.overallScores.confidence,
      grammar: int.overallScores.grammar,
    }));

    // Interview type breakdown
    const typeBreakdown = interviews.reduce((acc, int) => {
      acc[int.type] = (acc[int.type] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      analytics: {
        weeklyPerformance: weeklyData,
        skillsGrowth: skillsData,
        typeBreakdown: Object.entries(typeBreakdown).map(([type, count]) => ({ type, count })),
        totalInterviews: interviews.length,
        averageScore:
          interviews.length > 0
            ? Math.round(
                interviews.reduce((sum, i) => sum + i.overallScores.overall, 0) / interviews.length
              )
            : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updatePassword, uploadProfilePicture, deleteAccount, getAnalytics };
