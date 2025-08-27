const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // Adjust path as needed

// GET all certifications (public)
router.get('/', async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`SELECT * FROM Certifications ORDER BY year DESC, id DESC`;
  res.json(result.recordset);
});

// CREATE a certification (protected)
router.post('/', requireAuth, async (req, res) => {
  const { name, issuer, year } = req.body;
  if (!name || !issuer || !year) return res.status(400).json({ error: 'All fields are required' });
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`
    INSERT INTO Certifications (name, issuer, year)
    VALUES (${name}, ${issuer}, ${year});
    SELECT * FROM Certifications WHERE id = SCOPE_IDENTITY();
  `;
  res.status(201).json(result.recordset[0]);
});

// UPDATE a certification (protected)
router.put('/:id', requireAuth, async (req, res) => {
  const { name, issuer, year } = req.body;
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`
    UPDATE Certifications
    SET name = ${name}, issuer = ${issuer}, year = ${year}
    WHERE id = ${req.params.id};
    SELECT * FROM Certifications WHERE id = ${req.params.id};
  `;
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Certification not found' });
  res.json(result.recordset[0]);
});

// DELETE a certification (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  await sql.connect(process.env.MSSQL_CONN_STRING);
  const result = await sql.query`DELETE FROM Certifications WHERE id = ${req.params.id}`;
  if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Certification not found' });
  res.json({ success: true });
});

module.exports = router;