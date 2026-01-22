const express = require('express');
const { body, validationResult } = require('express-validator');
const Speaker = require('../models/Speaker');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

// GET speakers by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const speakers = await Speaker.findByEventId(parseInt(req.params.eventId));
    res.json(speakers);
  } catch (error) {
    console.error('Error fetching speakers:', error);
    res.status(500).json({ error: 'Failed to fetch speakers' });
  }
});

// GET single speaker
router.get('/:id', async (req, res) => {
  try {
    const speaker = await Speaker.findById(parseInt(req.params.id));
    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found' });
    }
    res.json(speaker);
  } catch (error) {
    console.error('Error fetching speaker:', error);
    res.status(500).json({ error: 'Failed to fetch speaker' });
  }
});

// POST create speaker
router.post('/',
  ensureAdmin,
  [
    body('eventId').isInt().withMessage('Event ID is required'),
    body('name').trim().notEmpty().withMessage('Name is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const speaker = await Speaker.create(req.body);
      res.status(201).json(speaker);
    } catch (error) {
      console.error('Error creating speaker:', error);
      res.status(500).json({ error: 'Failed to create speaker' });
    }
  }
);

// PUT update speaker
router.put('/:id',
  ensureAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const speaker = await Speaker.update(parseInt(req.params.id), req.body);
      if (!speaker) {
        return res.status(404).json({ error: 'Speaker not found' });
      }
      res.json(speaker);
    } catch (error) {
      console.error('Error updating speaker:', error);
      res.status(500).json({ error: 'Failed to update speaker' });
    }
  }
);

// DELETE speaker
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const deleted = await Speaker.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Speaker not found' });
    }
    res.json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    console.error('Error deleting speaker:', error);
    res.status(500).json({ error: 'Failed to delete speaker' });
  }
});

module.exports = router;
