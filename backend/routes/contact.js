const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed

// POST /api/contact
router.post('/', requireAuth, async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    await sql.query`
      INSERT INTO Messages (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;
    res.status(201).json({ success: true, message: 'Message sent!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact (admin only: get all messages)
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM Messages ORDER BY sent_at DESC`;
    res.json(result.recordset);
  } catch (err) {
    res.set('Cache-Control', 'no-store');
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact/:id (admin only: delete a message)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`DELETE FROM Messages WHERE id = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;