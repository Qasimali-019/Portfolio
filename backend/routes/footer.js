const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { requireAuth } = require('./auth'); // adjust path as needed

// GET footer content (all fields as JSON)
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT TOP 1 * FROM Footer ORDER BY id DESC`;
    // Parse the JSON data column, fallback to empty object
    res.json(result.recordset[0]?.data ? JSON.parse(result.recordset[0].data) : {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE footer content (all fields as JSON)
router.put('/', requireAuth, async (req, res) => {
  const data = JSON.stringify(req.body); // Store the whole footer object as JSON
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const check = await sql.query`SELECT TOP 1 * FROM Footer`;
    if (check.recordset.length === 0) {
      await sql.query`INSERT INTO Footer (data) VALUES (${data})`;
    } else {
      await sql.query`UPDATE Footer SET data = ${data} WHERE id = ${check.recordset[0].id}`;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;