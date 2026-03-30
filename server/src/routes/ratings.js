const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/ratings/:contentId
router.get('/:contentId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.username, u.display_name, u.avatar_url
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.content_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.contentId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/ratings
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content_id, score, review_text } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    await pool.query(
      `INSERT INTO ratings (user_id, content_id, score, review_text)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score = ?, review_text = ?`,
      [req.user.id, content_id, score, review_text || null, score, review_text || null]
    );

    // Update average rating
    const [avg] = await pool.query(
      'SELECT AVG(score) as avg_score FROM ratings WHERE content_id = ?',
      [content_id]
    );
    await pool.query(
      'UPDATE content SET rating_avg = ? WHERE id = ?',
      [avg[0].avg_score, content_id]
    );

    res.json({ message: 'Rating saved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/ratings/:contentId
router.delete('/:contentId', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM ratings WHERE user_id = ? AND content_id = ?',
      [req.user.id, req.params.contentId]
    );

    const [avg] = await pool.query(
      'SELECT AVG(score) as avg_score FROM ratings WHERE content_id = ?',
      [req.params.contentId]
    );
    await pool.query(
      'UPDATE content SET rating_avg = COALESCE(?, 0) WHERE id = ?',
      [avg[0].avg_score, req.params.contentId]
    );

    res.json({ message: 'Rating deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
