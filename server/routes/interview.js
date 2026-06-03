const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { startInterview, submitAnswer, completeInterview, getHistory, getReport, deleteInterview } = require('../controllers/interviewController');

router.post('/start', protect, startInterview);
router.post('/answer', protect, submitAnswer);
router.post('/complete/:id', protect, completeInterview);
router.get('/history', protect, getHistory);
router.get('/report/:id', protect, getReport);
router.delete('/:id', protect, deleteInterview);

module.exports = router;
