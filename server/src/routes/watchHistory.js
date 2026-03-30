const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/watch-history/continue-watching
router.get('/continue-watching', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, wh.progress_seconds, wh.duration_seconds, wh.episode_id, wh.updated_at as last_watched,
              e.title as episode_title, e.episode_number, s.season_number
       FROM watch_history wh
       JOIN content c ON wh.content_id = c.id
       LEFT JOIN episodes e ON wh.episode_id = e.id
       LEFT JOIN seasons s ON e.season_id = s.id
       WHERE wh.user_id = ? AND wh.completed = FALSE AND wh.progress_seconds > 0
       ORDER BY wh.updated_at DESC
       LIMIT 12`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/watch-history/progress
router.put('/progress', authenticateToken, async (req, res) => {
  try {
    const { content_id, episode_id, progress_seconds, duration_seconds } = req.body;
    const completed = duration_seconds > 0 && progress_seconds >= duration_seconds * 0.9;

    await pool.query(
      `INSERT INTO watch_history (user_id, content_id, episode_id, progress_seconds, duration_seconds, completed)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE progress_seconds = ?, duration_seconds = ?, completed = ?`,
      [req.user.id, content_id, episode_id || null, progress_seconds, duration_seconds, completed,
       progress_seconds, duration_seconds, completed]
    );
    res.json({ message: 'Progress updated', completed });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/watch-history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, wh.progress_seconds, wh.duration_seconds, wh.completed, wh.updated_at as last_watched
       FROM watch_history wh
       JOIN content c ON wh.content_id = c.id
       WHERE wh.user_id = ?
       ORDER BY wh.updated_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
