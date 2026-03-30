const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/search?q=
router.get('/', async (req, res) => {
  try {
    const { q, type, page = 1, limit = 20 } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ data: [], total: 0 });
    }

    const offset = (page - 1) * limit;
    const searchTerm = `%${q.trim()}%`;
    let typeFilter = '';
    const params = [searchTerm, searchTerm];

    if (type) {
      typeFilter = 'AND c.type = ?';
      params.push(type);
    }

    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(
      `SELECT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE c.status = 'published'
       AND (c.title LIKE ? OR c.description LIKE ?)
       ${typeFilter}
       GROUP BY c.id
       ORDER BY c.view_count DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = [searchTerm, searchTerm];
    if (type) countParams.push(type);

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM content c
       WHERE c.status = 'published' AND (c.title LIKE ? OR c.description LIKE ?) ${typeFilter}`,
      countParams
    );

    res.json({
      data: rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })),
      total: countResult[0].total,
      query: q.trim(),
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
