const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sql = require('mssql');

const app = express();
const { requireAuth } = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    console.log('✅ MSSQL pool connected'); // <-- ADD THIS LINE

    // API Routes
    app.use('/uploads', express.static('uploads'));
    app.use('/api/projects', require('./routes/projects'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/skills', require('./routes/skills'));
    app.use('/api/about', require('./routes/about'));
   app.use('/api/hero', require('./routes/hero'));
    app.use('/api/footer', require('./routes/footer'));
    app.use('/api/contact', requireAuth, require('./routes/contact'));
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/stats', require('./routes/stats'));
    app.use('/api/techtags', require('./routes/techtags'));
    app.use('/api/project-types', require('./routes/projectTypes'));
    app.use('/api/familiartags', require('./routes/familiartags'));
    app.use('/api/skills-content', require('./routes/skillsContent'));
    app.use('/api/contact-info', require('./routes/contactInfo'));
    app.use('/api/social-links', require('./routes/socialLinks'));
    app.use('/api/contact-content', require('./routes/contactContent'));
    app.use('/api/db', require('./routes/db'));
    app.use('/api/experience-content', require('./routes/experienceContent'));
    app.use('/api/certifications', require('./routes/certifications'));
    app.use('/api/resume', require('./routes/resume'));

    // Health check route
    app.get('/api/health', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    await sql.query`SELECT 1 as number`;
    res.json({ status: 'OK', db: 'connected', time: new Date() });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', db: 'disconnected', error: err.message });
  }
});

    // 404 handler for unknown API routes
    app.use('/api/*', (req, res) => {
      res.status(404).json({ error: 'API route not found' });
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to SQL Server:', err);
    process.exit(1);
  }
})();