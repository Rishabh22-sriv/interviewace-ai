const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { uploadResume, getResumeReport, getResumeHistory, deleteResume } = require('../controllers/resumeController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `resume-${Date.now()}.pdf`),
});

const pdfUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
      return cb(null, true);
    }
    cb(new Error('Only PDF files are allowed'));
  },
});

router.post('/upload', protect, pdfUpload.single('resume'), uploadResume);
router.get('/history', protect, getResumeHistory);
router.get('/report/:id', protect, getResumeReport);
router.delete('/:id', protect, deleteResume);

module.exports = router;
