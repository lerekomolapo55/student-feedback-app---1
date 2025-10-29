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
  const query = 'SELECT * FROM feedback ORDER BY createdat DESC';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching feedback:', err.message);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
    res.json(result.rows);
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
    INSERT INTO feedback (studentname, coursecode, comments, rating)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  db.query(query, [studentName, courseCode, comments, rating], (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err.message);
      return res.status(500).json({ error: 'Failed to submit feedback' });
    }

    res.status(201).json({
      id: result.rows[0].id,
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

  const query = 'DELETE FROM feedback WHERE id = $1';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting feedback:', err.message);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  });
});

// GET dashboard stats
app.get('/api/dashboard', async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) as totalfeedback,
        AVG(rating) as averagerating,
        COUNT(DISTINCT coursecode) as totalcourses
      FROM feedback
    `;

    const recentQuery = 'SELECT * FROM feedback ORDER BY createdat DESC LIMIT 5';

    const statsResult = await db.query(statsQuery);
    const stats = statsResult.rows[0];

    const recentResult = await db.query(recentQuery);
    const recentFeedback = recentResult.rows;

    res.json({
      totalFeedback: parseInt(stats.totalfeedback) || 0,
      averageRating: stats.averagerating ? parseFloat(parseFloat(stats.averagerating).toFixed(2)) : 0,
      totalCourses: parseInt(stats.totalcourses) || 0,
      recentFeedback
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
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