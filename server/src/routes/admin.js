const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const upload = require('../middleware/upload');
const { slugify } = require('../utils/helpers');

const router = express.Router();
router.use(authenticateToken, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalContent] = await pool.query('SELECT COUNT(*) as count FROM content');
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [totalViews] = await pool.query('SELECT SUM(view_count) as total FROM content');
    const [totalMovies] = await pool.query('SELECT COUNT(*) as count FROM content WHERE type = "movie"');
    const [totalSeries] = await pool.query('SELECT COUNT(*) as count FROM content WHERE type = "series"');
    const [recentContent] = await pool.query(
      'SELECT * FROM content ORDER BY created_at DESC LIMIT 5'
    );
    const [topContent] = await pool.query(
      'SELECT * FROM content WHERE status = "published" ORDER BY view_count DESC LIMIT 5'
    );

    res.json({
      totalContent: totalContent[0].count,
      totalUsers: totalUsers[0].count,
      totalViews: totalViews[0].total || 0,
      totalMovies: totalMovies[0].count,
      totalSeries: totalSeries[0].count,
      recentContent,
      topContent,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/content
router.get('/content', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    const offset = (page - 1) * limit;
    let where = ['1=1'];
    let params = [];

    if (status) { where.push('status = ?'); params.push(status); }
    if (type) { where.push('type = ?'); params.push(type); }

    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(
      `SELECT * FROM content WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      params
    );
    const countParams = params.slice(0, -2);
    const [total] = await pool.query(
      `SELECT COUNT(*) as count FROM content WHERE ${where.join(' AND ')}`,
      countParams
    );

    res.json({ data: rows, total: total[0].count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/content
router.post('/content', async (req, res) => {
  try {
    const {
      title, type, description, poster_url, backdrop_url, trailer_url,
      video_url, video_source, duration_minutes, release_date,
      ai_model, ai_prompt, ai_making_of, is_featured, status, genres
    } = req.body;

    const slug = slugify(title);

    const [result] = await pool.query(
      `INSERT INTO content (title, slug, type, description, poster_url, backdrop_url, trailer_url,
        video_url, video_source, duration_minutes, release_date, ai_model, ai_prompt, ai_making_of,
        is_featured, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, type, description, poster_url, backdrop_url, trailer_url,
       video_url, video_source || 'external', duration_minutes, release_date,
       ai_model, ai_prompt, ai_making_of, is_featured || false, status || 'draft', req.user.id]
    );

    if (genres && genres.length > 0) {
      const values = genres.map(gid => [result.insertId, gid]);
      await pool.query('INSERT INTO content_genres (content_id, genre_id) VALUES ?', [values]);
    }

    res.status(201).json({ id: result.insertId, slug });
  } catch (err) {
    console.error('Create content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/content/:id
router.put('/content/:id', async (req, res) => {
  try {
    const {
      title, type, description, poster_url, backdrop_url, trailer_url,
      video_url, video_source, duration_minutes, release_date,
      ai_model, ai_prompt, ai_making_of, is_featured, status, genres
    } = req.body;

    const slug = slugify(title);

    await pool.query(
      `UPDATE content SET title=?, slug=?, type=?, description=?, poster_url=?, backdrop_url=?,
        trailer_url=?, video_url=?, video_source=?, duration_minutes=?, release_date=?,
        ai_model=?, ai_prompt=?, ai_making_of=?, is_featured=?, status=?
       WHERE id=?`,
      [title, slug, type, description, poster_url, backdrop_url, trailer_url,
       video_url, video_source, duration_minutes, release_date,
       ai_model, ai_prompt, ai_making_of, is_featured, status, req.params.id]
    );

    if (genres) {
      await pool.query('DELETE FROM content_genres WHERE content_id = ?', [req.params.id]);
      if (genres.length > 0) {
        const values = genres.map(gid => [parseInt(req.params.id), gid]);
        await pool.query('INSERT INTO content_genres (content_id, genre_id) VALUES ?', [values]);
      }
    }

    res.json({ message: 'Content updated', slug });
  } catch (err) {
    console.error('Update content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/content/:id
router.delete('/content/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM content WHERE id = ?', [req.params.id]);
    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.destination.split('uploads')[1]}/${req.file.filename}`.replace(/\\/g, '/');
  res.json({ url: fileUrl, filename: req.file.filename });
});

// GENRES CRUD
router.get('/genres', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM genres ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/genres', async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name);
    const [result] = await pool.query('INSERT INTO genres (name, slug) VALUES (?, ?)', [name, slug]);
    res.status(201).json({ id: result.insertId, name, slug });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/genres/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM genres WHERE id = ?', [req.params.id]);
    res.json({ message: 'Genre deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// USERS
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.display_name, u.role, u.created_at,
              sp.name as plan_name
       FROM users u
       LEFT JOIN subscription_plans sp ON u.subscription_plan_id = sp.id
       ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// SEASONS & EPISODES
router.post('/seasons', async (req, res) => {
  try {
    const { content_id, season_number, title } = req.body;
    const [result] = await pool.query(
      'INSERT INTO seasons (content_id, season_number, title) VALUES (?, ?, ?)',
      [content_id, season_number, title]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/episodes', async (req, res) => {
  try {
    const { season_id, episode_number, title, description, video_url, video_source, duration_minutes, ai_model } = req.body;
    const [result] = await pool.query(
      `INSERT INTO episodes (season_id, episode_number, title, description, video_url, video_source, duration_minutes, ai_model)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [season_id, episode_number, title, description, video_url, video_source || 'external', duration_minutes, ai_model]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
