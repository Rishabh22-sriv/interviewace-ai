const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, updatePassword, uploadProfilePicture, deleteAccount, getAnalytics } = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`),
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp/;
    if (types.test(path.extname(file.originalname).toLowerCase()) && types.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'));
  },
});

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/profile-picture', protect, imageUpload.single('profilePicture'), uploadProfilePicture);
router.delete('/account', protect, deleteAccount);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
