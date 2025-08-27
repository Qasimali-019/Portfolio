const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed


// GET all skills
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM Skills ORDER BY id DESC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single skill by ID
router.get('/:id', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM Skills WHERE id = ${req.params.id}`;
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new skill
router.post('/', requireAuth, async (req, res) => {
  const { name, level, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'Name and category are required' });
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      INSERT INTO Skills (name, level, category)
      VALUES (${name}, ${level}, ${category});
      SELECT * FROM Skills WHERE id = SCOPE_IDENTITY();
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error in /api/skills POST:', err); // <--- Add this
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a skill
router.put('/:id', requireAuth, async (req, res) => {
  const { name, level } = req.body;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      UPDATE Skills
      SET name = ${name}, level = ${level}
      WHERE id = ${req.params.id};
      SELECT * FROM Skills WHERE id = ${req.params.id};
    `;
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a skill
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`DELETE FROM Skills WHERE id = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;