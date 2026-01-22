const express = require('express');
const upload = require('../middleware/upload');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

// POST upload image
router.post('/image', ensureAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `uploads/events/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
