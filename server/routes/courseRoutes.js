const express = require('express');
const router = express.Router();
const { getAllCourses, addCourse } = require('../controllers/courseController');
const { verifyToken } = require('../middleware/authMiddleware');


router.get('/', getAllCourses);
router.post('/', addCourse);

// 🔒 Protected route (Premium access only)
router.get('/premium', verifyToken, (req, res) => {
res.json({ message: `🔓 Welcome ${req.user.email}, you have premium access.` });
});

module.exports = router;