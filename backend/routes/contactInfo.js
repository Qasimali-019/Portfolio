const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed
// GET all contact info
router.get('/', async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`SELECT * FROM ContactInfo ORDER BY id ASC`;
  res.set('Cache-Control', 'no-store');
  res.json(result.recordset);
});

// ADD contact info
router.post('/', requireAuth, async (req, res) => {
  const { label, value, href, icon } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`INSERT INTO ContactInfo (label, value, href, icon) VALUES (${label}, ${value}, ${href}, ${icon})`;
  const result = await sql.query`SELECT * FROM ContactInfo ORDER BY id ASC`;
  res.json(result.recordset);
});

// UPDATE contact info
router.put('/:id', requireAuth, async (req, res) => {
  const { label, value, href, icon } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`UPDATE ContactInfo SET label=${label}, value=${value}, href=${href}, icon=${icon} WHERE id=${req.params.id}`;
  res.json({ success: true });
});

// DELETE contact info
router.delete('/:id', requireAuth, async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  await sql.query`DELETE FROM ContactInfo WHERE id=${req.params.id}`;
  res.json({ success: true });
});

module.exports = router;