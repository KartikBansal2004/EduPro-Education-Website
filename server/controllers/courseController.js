const db = require('../db/dbConnection');

exports.getAllCourses = (req, res) => {
  const sql = 'SELECT * FROM courses';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.addCourse = (req, res) => {
  const { title, description, price, isPremium } = req.body;
  const sql = 'INSERT INTO courses (title, description, price, isPremium) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, description, price, isPremium], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Course added", id: result.insertId });
  });
};