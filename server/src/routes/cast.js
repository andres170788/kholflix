const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/cast/:id
router.get('/:id', async (req, res) => {
  try {
    const [members] = await pool.query('SELECT * FROM cast_members WHERE id = ?', [req.params.id]);
    if (members.length === 0) return res.status(404).json({ error: 'Cast member not found' });

    const [filmography] = await pool.query(
      `SELECT c.*, cc.role, cc.character_name
       FROM content_cast cc
       JOIN content c ON cc.content_id = c.id
       WHERE cc.cast_member_id = ? AND c.status = 'published'
       ORDER BY c.release_date DESC`,
      [req.params.id]
    );

    res.json({ ...members[0], filmography });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
