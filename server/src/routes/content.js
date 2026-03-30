const express = require('express');
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/content - List content with filters
router.get('/', async (req, res) => {
  try {
    const { type, genre, sort = 'latest', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = ['c.status = "published"'];
    let params = [];
    let join = '';

    if (type) {
      where.push('c.type = ?');
      params.push(type);
    }
    if (genre) {
      join = 'JOIN content_genres cg ON c.id = cg.content_id JOIN genres g ON cg.genre_id = g.id';
      where.push('g.slug = ?');
      params.push(genre);
    }

    let orderBy = 'c.created_at DESC';
    if (sort === 'popular') orderBy = 'c.view_count DESC';
    else if (sort === 'rating') orderBy = 'c.rating_avg DESC';
    else if (sort === 'title') orderBy = 'c.title ASC';

    const [rows] = await pool.query(
      `SELECT DISTINCT c.*, GROUP_CONCAT(DISTINCT g2.name) as genres
       FROM content c
       ${join}
       LEFT JOIN content_genres cg2 ON c.id = cg2.content_id
       LEFT JOIN genres g2 ON cg2.genre_id = g2.id
       WHERE ${where.join(' AND ')}
       GROUP BY c.id
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(DISTINCT c.id) as total FROM content c ${join} WHERE ${where.join(' AND ')}`,
      params
    );

    res.json({
      data: rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })),
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (err) {
    console.error('Content list error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/featured
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE c.is_featured = TRUE AND c.status = 'published'
       GROUP BY c.id
       ORDER BY c.view_count DESC
       LIMIT 5`
    );
    res.json(rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })));
  } catch (err) {
    console.error('Featured error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/trending
router.get('/trending', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE c.status = 'published'
       GROUP BY c.id
       ORDER BY c.view_count DESC
       LIMIT 12`
    );
    res.json(rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/latest
router.get('/latest', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE c.status = 'published'
       GROUP BY c.id
       ORDER BY c.release_date DESC
       LIMIT 12`
    );
    res.json(rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/popular
router.get('/popular', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE c.status = 'published'
       GROUP BY c.id
       ORDER BY c.rating_avg DESC
       LIMIT 12`
    );
    res.json(rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/:slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE c.slug = ? AND c.status = 'published'
       GROUP BY c.id`,
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Increment view count
    await pool.query('UPDATE content SET view_count = view_count + 1 WHERE id = ?', [rows[0].id]);

    // Get cast
    const [cast] = await pool.query(
      `SELECT cm.*, cc.role, cc.character_name
       FROM content_cast cc
       JOIN cast_members cm ON cc.cast_member_id = cm.id
       WHERE cc.content_id = ?`,
      [rows[0].id]
    );

    // Check user lists
    let inWatchlist = false;
    let inFavorites = false;
    let userRating = null;
    if (req.user) {
      const [wl] = await pool.query('SELECT id FROM watchlist WHERE user_id = ? AND content_id = ?', [req.user.id, rows[0].id]);
      inWatchlist = wl.length > 0;
      const [fv] = await pool.query('SELECT id FROM favorites WHERE user_id = ? AND content_id = ?', [req.user.id, rows[0].id]);
      inFavorites = fv.length > 0;
      const [rt] = await pool.query('SELECT score, review_text FROM ratings WHERE user_id = ? AND content_id = ?', [req.user.id, rows[0].id]);
      userRating = rt.length > 0 ? rt[0] : null;
    }

    const content = {
      ...rows[0],
      genres: rows[0].genres ? rows[0].genres.split(',') : [],
      cast,
      inWatchlist,
      inFavorites,
      userRating,
    };

    res.json(content);
  } catch (err) {
    console.error('Content detail error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/:slug/episodes
router.get('/:slug/episodes', async (req, res) => {
  try {
    const [content] = await pool.query('SELECT id FROM content WHERE slug = ?', [req.params.slug]);
    if (content.length === 0) return res.status(404).json({ error: 'Content not found' });

    const [seasons] = await pool.query(
      'SELECT * FROM seasons WHERE content_id = ? ORDER BY season_number',
      [content[0].id]
    );

    const result = [];
    for (const season of seasons) {
      const [episodes] = await pool.query(
        'SELECT * FROM episodes WHERE season_id = ? ORDER BY episode_number',
        [season.id]
      );
      result.push({ ...season, episodes });
    }

    res.json(result);
  } catch (err) {
    console.error('Episodes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/:id/making-of
router.get('/:id/making-of', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, ai_model, ai_prompt, ai_making_of FROM content WHERE id = ? AND status = "published"',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Content not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/:id/recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    // Get genres of this content
    const [genres] = await pool.query(
      'SELECT genre_id FROM content_genres WHERE content_id = ?',
      [req.params.id]
    );
    if (genres.length === 0) return res.json([]);

    const genreIds = genres.map(g => g.genre_id);
    const [rows] = await pool.query(
      `SELECT DISTINCT c.*, GROUP_CONCAT(DISTINCT g.name) as genres
       FROM content c
       JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE cg.genre_id IN (?) AND c.id != ? AND c.status = 'published'
       GROUP BY c.id
       ORDER BY c.rating_avg DESC
       LIMIT 8`,
      [genreIds, req.params.id]
    );
    res.json(rows.map(r => ({ ...r, genres: r.genres ? r.genres.split(',') : [] })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/content/episode/:id - Get single episode with series info
router.get('/episode/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, s.content_id, s.season_number, s.title as season_title,
             c.title as series_title, c.slug as series_slug
      FROM episodes e
      JOIN seasons s ON e.season_id = s.id
      JOIN content c ON s.content_id = c.id
      WHERE e.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Episode not found' });

    // Get all episodes in same season for prev/next navigation
    const episode = rows[0];
    const [siblings] = await pool.query(`
      SELECT id, episode_number, title FROM episodes
      WHERE season_id = ? ORDER BY episode_number
    `, [episode.season_id]);

    res.json({ ...episode, siblings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
