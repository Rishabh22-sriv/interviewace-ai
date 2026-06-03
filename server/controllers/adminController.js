const User = require('../models/User');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalInterviews = await Interview.countDocuments({ status: 'completed' });
    const activeUsers = await User.countDocuments({
      role: 'student',
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const interviews = await Interview.find({ status: 'completed' }).select('overallScores');
    const avgScore =
      interviews.length > 0
        ? Math.round(
            interviews.reduce((sum, i) => sum + i.overallScores.overall, 0) / interviews.length
          )
        : 0;

    // New users per week (last 4 weeks)
    const weeklyUsers = [];
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      const count = await User.countDocuments({ createdAt: { $gte: start, $lt: end } });
      weeklyUsers.push({ week: `Week ${4 - i}`, users: count });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalInterviews,
        activeUsers,
        averageScore: avgScore,
        weeklyUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = {
      role: 'student',
      ...(search && { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }),
    };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password -resetPasswordToken -resetPasswordExpire');

    // Enrich with interview counts
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const interviewCount = await Interview.countDocuments({ userId: user._id });
        return { ...user.toObject(), interviewCount };
      })
    );

    res.status(200).json({
      success: true,
      users: enrichedUsers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/user/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    }

    // Delete user's data
    await Interview.deleteMany({ userId: user._id });
    await Resume.deleteMany({ userId: user._id });

    // Delete profile picture from Cloudinary
    if (user.profilePicturePublicId) {
      await cloudinary.uploader.destroy(user.profilePicturePublicId).catch(console.error);
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User and all associated data deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interviews (admin)
// @route   GET /api/admin/interviews
const getAllInterviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Interview.countDocuments();
    const interviews = await Interview.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .select('-questions.answer -questions.feedback');

    res.status(200).json({
      success: true,
      interviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export data as CSV
// @route   GET /api/admin/export/users
const exportUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' }).select('name email totalInterviews averageScore createdAt lastLogin isActive');

    const csvHeader = 'Name,Email,Total Interviews,Average Score,Joined,Last Login,Active\n';
    const csvRows = users.map((u) =>
      `"${u.name}","${u.email}",${u.totalInterviews},${u.averageScore},"${new Date(u.createdAt).toLocaleDateString()}","${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}",${u.isActive}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csvHeader + csvRows);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/user/:id/toggle
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, deleteUser, getAllInterviews, exportUsers, toggleUserStatus };
