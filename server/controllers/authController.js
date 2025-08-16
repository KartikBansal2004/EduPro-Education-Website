const db = require('../db/dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: "User already exists or DB error." });
    res.json({ message: 'User registered successfully', userId: result.insertId });
  });
};

// Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, "60bfbe365666be7256e47fe4f110296a77bfec74acffaf3017ace26f824aed52bde1f91478dbabe75dd4b8d95aa85fa2a0c80d96169caa378493f5b1d3e600dc", {
      expiresIn: '7d',
    });

    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, isPremium: user.isPremium } });
  });
};