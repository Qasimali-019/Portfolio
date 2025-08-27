const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed
// GET section content
router.get('/', async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`SELECT TOP 1 * FROM SkillsContent ORDER BY id DESC`;
  res.json(result.recordset[0] || {});
});

// UPDATE section content
router.put('/', requireAuth, async (req, res) =>  {
  const { title, description } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const check = await sql.query`SELECT TOP 1 * FROM SkillsContent`;
  if (check.recordset.length === 0) {
    await sql.query`INSERT INTO SkillsContent (title, description) VALUES (${title}, ${description})`;
  } else {
    await sql.query`UPDATE SkillsContent SET title=${title}, description=${description} WHERE id=${check.recordset[0].id}`;
  }
  const result = await sql.query`SELECT TOP 1 * FROM SkillsContent ORDER BY id DESC`;
  res.json(result.recordset[0]);
});

module.exports = router;