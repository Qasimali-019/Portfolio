const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('./auth'); // adjust path as needed

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resume/'),
  filename: (req, file, cb) => cb(null, 'resume.pdf')
});
const upload = multer({ storage });

router.post('/upload', requireAuth, upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ success: true });
});

router.delete('/delete', requireAuth, (req, res) => {
  const filePath = path.join(__dirname, '../uploads/resume/resume.pdf');
  require('fs').unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: 'Resume not found' });
    res.json({ success: true });
  });
});

module.exports = router;