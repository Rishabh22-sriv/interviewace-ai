const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['interview', 'streak', 'placement', 'job', 'achievement', 'tip', 'system'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
    icon: { type: String, default: 'bell' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
