exports.askChatbot = (req, res) => {
  const { message } = req.body;
  const db = require('../db/dbConnection');

  db.query('SELECT isPremium, chatbot_trial_start, has_used_trial FROM users WHERE id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];

    // ✅ If premium, allow access
    if (user.isPremium) {
      return res.json({ reply: `🤖 Premium: You said: "${message}"` });
    }

    // ⏳ Check 7-day trial
    const now = new Date();

    if (!user.has_used_trial) {
      const trialStart = user.chatbot_trial_start || now;

      // If trial not started yet, start it now
      if (!user.chatbot_trial_start) {
        db.query('UPDATE users SET chatbot_trial_start = ?, has_used_trial = ? WHERE id = ?', [now, true, req.user.id], () => {});
      }

      const trialEnd = new Date(trialStart);
      trialEnd.setDate(trialEnd.getDate() + 7);

      if (now <= trialEnd) {
        return res.json({ reply: `🧪 Trial: You said: "${message}"` });
      } else {
        return res.status(403).json({ error: 'Your free trial has expired. Please upgrade to premium to continue.' });
      }
    }

    // ❌ Trial expired and user is not premium
    return res.status(403).json({ error: 'Chatbot access denied. Upgrade to premium.' });
  });
};



