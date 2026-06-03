const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { getStats, getAllUsers, deleteUser, getAllInterviews, exportUsers, toggleUserStatus } = require('../controllers/adminController');

router.use(protect, adminAuth); // All admin routes require auth + admin role

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);
router.put('/user/:id/toggle', toggleUserStatus);
router.get('/interviews', getAllInterviews);
router.get('/export/users', exportUsers);

module.exports = router;
