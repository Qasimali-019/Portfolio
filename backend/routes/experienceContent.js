const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path if needed

// GET section content (public)
router.get('/', async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`SELECT TOP 1 * FROM ExperienceContent ORDER BY id DESC`;
  res.json(result.recordset[0] || {});
});

// UPDATE section content (admin only)
router.put('/', requireAuth, async (req, res) => {
  const { title, subtitle } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const check = await sql.query`SELECT TOP 1 * FROM ExperienceContent`;
  if (check.recordset.length === 0) {
    await sql.query`INSERT INTO ExperienceContent (title, subtitle) VALUES (${title}, ${subtitle})`;
  } else {
    await sql.query`UPDATE ExperienceContent SET title=${title}, subtitle=${subtitle} WHERE id=${check.recordset[0].id}`;
  }
  const result = await sql.query`SELECT TOP 1 * FROM ExperienceContent ORDER BY id DESC`;
  res.json(result.recordset[0]);
});

// DELETE section content
router.delete('/', requireAuth, async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`DELETE FROM ExperienceContent`;
  res.json({ success: true });
});

module.exports = router;