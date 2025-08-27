const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed

// GET all stats
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM Stats ORDER BY id ASC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD a stat
router.post('/', requireAuth, async (req, res) =>{
  const { label, value } = req.body;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    await sql.query`INSERT INTO Stats (label, value) VALUES (${label}, ${value})`;
    const result = await sql.query`SELECT * FROM Stats ORDER BY id ASC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a stat
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { label, value } = req.body;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    await sql.query`UPDATE Stats SET label=${label}, value=${value} WHERE id=${id}`;
    const result = await sql.query`SELECT * FROM Stats ORDER BY id ASC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a stat
router.delete('/:id', requireAuth, async (req, res) =>{
  const { id } = req.params;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    await sql.query`DELETE FROM Stats WHERE id=${id}`;
    const result = await sql.query`SELECT * FROM Stats ORDER BY id ASC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;