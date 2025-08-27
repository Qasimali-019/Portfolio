const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed

// GET all social links
router.get('/', async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`SELECT * FROM SocialLinks ORDER BY id ASC`;
  res.json(result.recordset);
});

// ADD social link
router.post('/', requireAuth, async (req, res) => {
  const { label, href, icon, color } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`INSERT INTO SocialLinks (label, href, icon, color) VALUES (${label}, ${href}, ${icon}, ${color})`;
  const result = await sql.query`SELECT * FROM SocialLinks ORDER BY id ASC`;
  res.json(result.recordset);
});

// UPDATE social link
router.put('/:id', requireAuth, async (req, res) =>  {
  const { label, href, icon, color } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`UPDATE SocialLinks SET label=${label}, href=${href}, icon=${icon}, color=${color} WHERE id=${req.params.id}`;
  res.json({ success: true });
});

// DELETE social link
router.delete('/:id', requireAuth, async (req, res)  => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`DELETE FROM SocialLinks WHERE id=${req.params.id}`;
  res.json({ success: true });
});

module.exports = router;