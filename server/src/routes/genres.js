const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/genres
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT g.*, COUNT(cg.content_id) as content_count
       FROM genres g
       LEFT JOIN content_genres cg ON g.id = cg.genre_id
       LEFT JOIN content c ON cg.content_id = c.id AND c.status = 'published'
       GROUP BY g.id
       ORDER BY g.name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/genres/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'latest' } = req.query;
    const offset = (page - 1) * limit;

    const [genre] = await pool.query('SELECT * FROM genres WHERE slug = ?', [req.params.slug]);
    if (genre.length === 0) return res.status(404).json({ error: 'Genre not found' });

    let orderBy = 'c.created_at DESC';
    if (sort === 'popular') orderBy = 'c.view_count DESC';
    else if (sort === 'rating') orderBy = 'c.rating_avg DESC';

    const [rows] = await pool.query(
      `SELECT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN content_genres cg2 ON c.id = cg2.content_id
       LEFT JOIN genres g ON cg2.genre_id = g.id
       WHERE cg.genre_id = ? AND c.status = 'published'
       GROUP BY c.id
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [genre[0].id, parseInt(limit), parseInt(offset)]
    );

    res.json({
      genre: genre[0],
      data: rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
