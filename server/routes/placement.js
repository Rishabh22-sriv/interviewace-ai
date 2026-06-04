const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Placement = require('../models/Placement');

// @route   GET /api/placement
// @desc    Get all placements for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const placements = await Placement.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: placements.length, data: placements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/placement/analytics
// @desc    Get placement analytics (counts by status, timeline)
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Count placements grouped by status
    const statusCounts = await Placement.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Timeline: applications per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const timeline = await Placement.aggregate([
      { $match: { user: userId, applicationDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$applicationDate' },
            month: { $month: '$applicationDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Overall totals
    const total = await Placement.countDocuments({ user: userId });
    const selected = await Placement.countDocuments({ user: userId, status: 'selected' });

    res.status(200).json({
      success: true,
      data: {
        total,
        selected,
        successRate: total > 0 ? ((selected / total) * 100).toFixed(1) : 0,
        statusCounts,
        timeline,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/placement
// @desc    Add a new placement entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { company, role, package: pkg, location, applicationDate, interviewDate, status, notes, jobUrl, round } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    const placement = await Placement.create({
      user: req.user._id,
      company,
      role,
      package: pkg,
      location,
      applicationDate,
      interviewDate,
      status,
      notes,
      jobUrl,
      round,
    });

    res.status(201).json({ success: true, data: placement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/placement/:id
// @desc    Update a placement entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement not found' });
    }

    // Ensure the placement belongs to the logged-in user
    if (placement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this placement' });
    }

    placement = await Placement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: placement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/placement/:id
// @desc    Delete a placement entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement not found' });
    }

    if (placement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this placement' });
    }

    await placement.deleteOne();

    res.status(200).json({ success: true, message: 'Placement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
