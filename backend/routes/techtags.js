const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed

// GET all tags
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM TechTags ORDER BY name`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new tag
router.post('/', requireAuth, async (req, res)  => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Tag name is required' });
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      INSERT INTO TechTags (name) VALUES (${name});
      SELECT * FROM TechTags WHERE id = SCOPE_IDENTITY();
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a tag
router.put('/:id', requireAuth, async (req, res) => {
  const { name } = req.body;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      UPDATE TechTags SET name = ${name} WHERE id = ${req.params.id};
      SELECT * FROM TechTags WHERE id = ${req.params.id};
    `;
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete a tag
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    await sql.query`DELETE FROM TechTags WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;