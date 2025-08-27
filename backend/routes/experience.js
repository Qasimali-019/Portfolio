const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path if needed

// GET all experience entries
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM Experience ORDER BY start_date DESC, id DESC`;
    const experiences = result.recordset.map(exp => ({
      ...exp,
      bullets: exp.bullets ? JSON.parse(exp.bullets) : []
    }));
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET a single experience by ID
router.get('/:id', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM Experience WHERE id = ${req.params.id}`;
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Experience not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new experience
router.post('/', requireAuth, async (req, res) => {
  const { company, role, location, description, start_date, end_date, bullets } = req.body;
  if (!company || !role) return res.status(400).json({ error: 'Company and role are required' });
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      INSERT INTO Experience (company, role, location, description, start_date, end_date, bullets)
      VALUES (${company}, ${role}, ${location}, ${description}, ${start_date}, ${end_date}, ${JSON.stringify(bullets)});
      SELECT * FROM Experience WHERE id = SCOPE_IDENTITY();
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE an experience
router.put('/:id', requireAuth, async (req, res) => {
  const { company, role, location, description, start_date, end_date, bullets } = req.body;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      UPDATE Experience
      SET company = ${company}, role = ${role}, location = ${location}, description = ${description},
          start_date = ${start_date}, end_date = ${end_date}, bullets = ${JSON.stringify(bullets)}
      WHERE id = ${req.params.id};
      SELECT * FROM Experience WHERE id = ${req.params.id};
    `;
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Experience not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an experience
router.delete('/:id', requireAuth, async (req, res)=> {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`DELETE FROM Experience WHERE id = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Experience not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;