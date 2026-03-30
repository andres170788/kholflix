const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/playlists
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, COUNT(pi.id) as item_count
       FROM playlists p
       LEFT JOIN playlist_items pi ON p.id = pi.playlist_id
       WHERE p.user_id = ?
       GROUP BY p.id
       ORDER BY p.updated_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/playlists
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    const [result] = await pool.query(
      'INSERT INTO playlists (user_id, name, description, is_public) VALUES (?, ?, ?, ?)',
      [req.user.id, name, description || null, is_public || false]
    );
    res.status(201).json({ id: result.insertId, name, description, is_public });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/playlists/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [playlist] = await pool.query(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (playlist.length === 0) return res.status(404).json({ error: 'Playlist not found' });

    const [items] = await pool.query(
      `SELECT c.*, pi.position, pi.id as item_id
       FROM playlist_items pi
       JOIN content c ON pi.content_id = c.id
       WHERE pi.playlist_id = ?
       ORDER BY pi.position`,
      [req.params.id]
    );

    res.json({ ...playlist[0], items });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/playlists/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    await pool.query(
      'UPDATE playlists SET name = ?, description = ?, is_public = ? WHERE id = ? AND user_id = ?',
      [name, description, is_public, req.params.id, req.user.id]
    );
    res.json({ message: 'Playlist updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/playlists/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM playlists WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Playlist deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/playlists/:id/items
router.post('/:id/items', authenticateToken, async (req, res) => {
  try {
    const { content_id } = req.body;
    const [maxPos] = await pool.query(
      'SELECT COALESCE(MAX(position), 0) + 1 as next_pos FROM playlist_items WHERE playlist_id = ?',
      [req.params.id]
    );
    await pool.query(
      'INSERT IGNORE INTO playlist_items (playlist_id, content_id, position) VALUES (?, ?, ?)',
      [req.params.id, content_id, maxPos[0].next_pos]
    );
    res.json({ message: 'Item added' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/playlists/:id/items/:itemId
router.delete('/:id/items/:itemId', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM playlist_items WHERE id = ? AND playlist_id = ?', [req.params.itemId, req.params.id]);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
