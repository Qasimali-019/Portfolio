const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed

// GET about content (assume only one row)
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT TOP 1 * FROM About ORDER BY id DESC`;
    res.json(result.recordset[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE about content (assume only one row, id=1)
router.put('/', requireAuth, async (req, res) => {
  const { content } = req.body;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    // If no row exists, insert; else, update
    const check = await sql.query`SELECT TOP 1 * FROM About`;
    if (check.recordset.length === 0) {
      await sql.query`INSERT INTO About (content) VALUES (${content})`;
    } else {
      await sql.query`UPDATE About SET content = ${content} WHERE id = ${check.recordset[0].id}`;
    }
    const result = await sql.query`SELECT TOP 1 * FROM About ORDER BY id DESC`;
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;