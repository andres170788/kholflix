const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/subscriptions/plans
router.get('/plans', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subscription_plans WHERE is_active = TRUE ORDER BY price');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/subscriptions/subscribe
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { plan_id } = req.body;

    const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [plan_id]);
    if (plans.length === 0) return res.status(404).json({ error: 'Plan not found' });

    // Cancel existing active subscriptions
    await pool.query(
      'UPDATE user_subscriptions SET status = "cancelled" WHERE user_id = ? AND status = "active"',
      [req.user.id]
    );

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + plans[0].interval_months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await pool.query(
      'INSERT INTO user_subscriptions (user_id, plan_id, status, start_date, end_date) VALUES (?, ?, "active", ?, ?)',
      [req.user.id, plan_id, startDate, endDate]
    );

    await pool.query('UPDATE users SET subscription_plan_id = ? WHERE id = ?', [plan_id, req.user.id]);

    res.json({ message: 'Subscription activated', plan: plans[0].name });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/subscriptions/current
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT us.*, sp.name, sp.price, sp.video_quality, sp.max_devices, sp.can_download, sp.features_json
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE us.user_id = ? AND us.status = 'active'
       ORDER BY us.created_at DESC
       LIMIT 1`,
      [req.user.id]
    );
    res.json(rows.length > 0 ? rows[0] : null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
