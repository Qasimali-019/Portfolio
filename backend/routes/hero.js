const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed
// GET hero content (assume only one row)
router.get('/', async (req, res) => {
  try {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`SELECT TOP 1 * FROM Hero ORDER BY id DESC`;
  res.json(result.recordset[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE hero content (assume only one row, id=1)
router.put('/', requireAuth, async (req, res) => {
  const { title, subtitle, description, image, resume, socials } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const check = await sql.query`SELECT TOP 1 * FROM Hero`;
  if (check.recordset.length === 0) {
    await sql.query`
      INSERT INTO Hero (title, subtitle, description, image, resume, socials)
      VALUES (${title}, ${subtitle}, ${description}, ${image}, ${resume}, ${JSON.stringify(socials)})
    `;
  } else {
    await sql.query`
      UPDATE Hero
      SET title=${title}, subtitle=${subtitle}, description=${description}, image=${image}, resume=${resume}, socials=${JSON.stringify(socials)}
      WHERE id=${check.recordset[0].id}
    `;
  }
  const result = await sql.query`SELECT TOP 1 * FROM Hero ORDER BY id DESC`;
  res.json(result.recordset[0]);
});
// (Optional) DELETE hero row
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    await sql.query`DELETE FROM Hero WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;