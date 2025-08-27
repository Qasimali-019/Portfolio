const express = require('express');
const router = express.Router();
const sql = require('mssql');
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('./auth'); // adjust path as needed

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists!
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET all projects with type name (dynamic type system)
router.get('/with-types', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query(`
      SELECT p.*, t.name AS type
      FROM Projects p
      LEFT JOIN ProjectTypes t ON p.typeId = t.id
      ORDER BY p.id DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all projects (basic, no tags)
router.get('/', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`SELECT * FROM Projects ORDER BY id DESC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all projects with tags
router.get('/with-tags/all', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const projectsResult = await sql.query`SELECT * FROM Projects ORDER BY id DESC`;
    const tagsResult = await sql.query`
      SELECT pt.projectId, t.id, t.name
      FROM ProjectTags pt
      JOIN TechTags t ON pt.tagId = t.id
    `;
    const projects = projectsResult.recordset.map(project => ({
      ...project,
      tags: tagsResult.recordset
        .filter(tag => tag.projectId === project.id)
        .map(tag => ({ id: tag.id, name: tag.name }))
    }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single project by ID (with tags)
router.get('/:id', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const projectResult = await sql.query`SELECT * FROM Projects WHERE id = ${req.params.id}`;
    if (projectResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const tagsResult = await sql.query`
      SELECT t.id, t.name
      FROM ProjectTags pt
      JOIN TechTags t ON pt.tagId = t.id
      WHERE pt.projectId = ${req.params.id}
    `;
    const project = projectResult.recordset[0];
    project.tags = tagsResult.recordset;
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new project
router.post('/', requireAuth, async (req, res) => {
const { title, description, image, link, github, typeId } = req.body;
if (!title || !typeId) return res.status(400).json({ error: 'Title and typeId are required' });
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
  INSERT INTO Projects (title, description, image, link, github, typeId)
  VALUES (${title}, ${description}, ${image}, ${link}, ${github}, ${typeId});
  SELECT * FROM Projects WHERE id = SCOPE_IDENTITY();
`;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error in /api/projects POST:', err); // <--- Add this
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a project
router.put('/:id', requireAuth, async (req, res) => {
 const { title, description, image, link, github } = req.body;
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      UPDATE Projects
       SET title = ${title}, description = ${description}, image = ${image}, link = ${link}, github = ${github}
  WHERE id = ${req.params.id};
  SELECT * FROM Projects WHERE id = ${req.params.id};
`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a project
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`DELETE FROM Projects WHERE id = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Also delete tags for this project
    await sql.query`DELETE FROM ProjectTags WHERE projectId = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Return the relative URL to the uploaded image
  res.json({ url: `/uploads/${req.file.filename}` });
});

// GET tags for a project
router.get('/:id/tags', async (req, res) => {
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    const result = await sql.query`
      SELECT t.id, t.name
      FROM ProjectTags pt
      JOIN TechTags t ON pt.tagId = t.id
      WHERE pt.projectId = ${req.params.id}
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ASSIGN/REPLACE tags for a project
router.post('/:id/tags', async (req, res) => {
  const { tagIds } = req.body; // expects: { tagIds: [1,2,3] }
  try {
    await sql.connect(process.env.MSSQL_CONN_STRING);
    // Remove old tags
    await sql.query`DELETE FROM ProjectTags WHERE projectId = ${req.params.id}`;
    // Add new tags
    for (const tagId of tagIds) {
      await sql.query`INSERT INTO ProjectTags (projectId, tagId) VALUES (${req.params.id}, ${tagId})`;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;