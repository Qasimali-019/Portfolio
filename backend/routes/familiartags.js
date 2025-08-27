const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed
router.get('/', async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`SELECT * FROM FamiliarTags ORDER BY name`;
  res.json(result.recordset);
});
router.post('/', requireAuth, async (req, res) => {
  const { name } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`INSERT INTO FamiliarTags (name) VALUES (${name})`;
  res.json({ success: true });
});
router.put('/:id', requireAuth, async (req, res) => {
  const { name } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`UPDATE FamiliarTags SET name=${name} WHERE id=${req.params.id}`;
  res.json({ success: true });
});
router.delete('/:id', requireAuth, async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`DELETE FROM FamiliarTags WHERE id=${req.params.id}`;
  res.json({ success: true });
});
module.exports = router;