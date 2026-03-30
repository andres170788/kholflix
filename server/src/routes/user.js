const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.username, u.email, u.display_name, u.avatar_url, u.role, u.created_at,
              sp.name as plan_name, sp.video_quality
       FROM users u
       LEFT JOIN subscription_plans sp ON u.subscription_plan_id = sp.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/user/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { display_name, avatar_url } = req.body;
    await pool.query(
      'UPDATE users SET display_name = ?, avatar_url = ? WHERE id = ?',
      [display_name, avatar_url, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/watchlist
router.get('/watchlist', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, w.created_at as added_at, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM watchlist w
       JOIN content c ON w.content_id = c.id
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE w.user_id = ?
       GROUP BY c.id
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json(rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/watchlist
router.post('/watchlist', authenticateToken, async (req, res) => {
  try {
    const { content_id } = req.body;
    await pool.query(
      'INSERT IGNORE INTO watchlist (user_id, content_id) VALUES (?, ?)',
      [req.user.id, content_id]
    );
    res.json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/user/watchlist/:contentId
router.delete('/watchlist/:contentId', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM watchlist WHERE user_id = ? AND content_id = ?',
      [req.user.id, req.params.contentId]
    );
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/favorites
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, f.created_at as added_at, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM favorites f
       JOIN content c ON f.content_id = c.id
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE f.user_id = ?
       GROUP BY c.id
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json(rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/favorites
router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { content_id } = req.body;
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, content_id) VALUES (?, ?)',
      [req.user.id, content_id]
    );
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/user/favorites/:contentId
router.delete('/favorites/:contentId', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND content_id = ?',
      [req.user.id, req.params.contentId]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
