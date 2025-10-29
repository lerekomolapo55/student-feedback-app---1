const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET all feedback
app.get('/api/feedback', (req, res) => {
  const query = 'SELECT * FROM Feedback ORDER BY createdAt DESC';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching feedback:', err.message);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
    res.json(rows);
  });
});

// POST new feedback
app.post('/api/feedback', (req, res) => {
  const { studentName, courseCode, comments, rating } = req.body;

  // Validation
  if (!studentName || !courseCode || !comments || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const query = `
    INSERT INTO Feedback (studentName, courseCode, comments, rating)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [studentName, courseCode, comments, rating], function(err) {
    if (err) {
      console.error('Error inserting feedback:', err.message);
      return res.status(500).json({ error: 'Failed to submit feedback' });
    }

    res.status(201).json({
      id: this.lastID,
      studentName,
      courseCode,
      comments,
      rating,
      message: 'Feedback submitted successfully'
    });
  });
});

// DELETE feedback
app.delete('/api/feedback/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Feedback WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting feedback:', err.message);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  });
});

// GET dashboard stats
app.get('/api/dashboard', (req, res) => {
  const statsQuery = `
    SELECT
      COUNT(*) as totalFeedback,
      AVG(rating) as averageRating,
      COUNT(DISTINCT courseCode) as totalCourses
    FROM Feedback
  `;

  const recentQuery = 'SELECT * FROM Feedback ORDER BY createdAt DESC LIMIT 5';

  db.get(statsQuery, [], (err, stats) => {
    if (err) {
      console.error('Error fetching stats:', err.message);
      return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }

    db.all(recentQuery, [], (err, recentFeedback) => {
      if (err) {
        console.error('Error fetching recent feedback:', err.message);
        return res.status(500).json({ error: 'Failed to fetch dashboard data' });
      }

      res.json({
        totalFeedback: stats.totalFeedback || 0,
        averageRating: stats.averageRating ? parseFloat(stats.averageRating.toFixed(2)) : 0,
        totalCourses: stats.totalCourses || 0,
        recentFeedback
      });
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});