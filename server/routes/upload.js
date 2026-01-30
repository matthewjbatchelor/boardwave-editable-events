const express = require('express');
const multer = require('multer');
const { ensureAdmin } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Use memory storage instead of disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST upload image - saves to database
router.post('/image', ensureAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert buffer to base64
    const base64Data = req.file.buffer.toString('base64');

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const safeName = req.file.originalname
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const filename = `${safeName}-${uniqueSuffix}.${ext}`;

    // Save to database
    const result = await query(
      'INSERT INTO media (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id, filename',
      [filename, req.file.mimetype, base64Data]
    );

    const imageUrl = `media/${result.rows[0].id}/${result.rows[0].filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET image from database
router.get('/media/:id/:filename', async (req, res) => {
  try {
    const result = await query(
      'SELECT mimetype, data FROM media WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const { mimetype, data } = result.rows[0];
    const buffer = Buffer.from(data, 'base64');

    res.set('Content-Type', mimetype);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

module.exports = router;
