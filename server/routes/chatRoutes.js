const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { askChatbot } = require('../controllers/chatController');

router.post('/', verifyToken, askChatbot);

module.exports = router;



