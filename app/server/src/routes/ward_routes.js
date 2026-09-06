import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/ward — returns all wards with id and name
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, name FROM wards ORDER BY id');
    res.json(result.rows); // assuming you're using pg
  } catch (err) {
    console.error('Error fetching wards:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch wards' });
  }
});


export default router;