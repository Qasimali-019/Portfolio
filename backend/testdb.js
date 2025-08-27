require('dotenv').config();
const sql = require('mssql');

sql.connect(process.env.MSSQL_CONN_STRING)
  .then(pool => pool.request().query('SELECT 1 as number'))
  .then(result => {
    console.log('Connected! Result:', result.recordset);
    sql.close();
  })
  .catch(err => {
    console.error('Connection error:', err);
  });