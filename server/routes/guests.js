const express = require('express');
const { body, validationResult } = require('express-validator');
const Guest = require('../models/Guest');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

// GET guests by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const guests = await Guest.findByEventId(parseInt(req.params.eventId));
    res.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

// GET single guest
router.get('/:id', async (req, res) => {
  try {
    const guest = await Guest.findById(parseInt(req.params.id));
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    console.error('Error fetching guest:', error);
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
});

// POST create guest
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
      const guest = await Guest.create(req.body);
      res.status(201).json(guest);
    } catch (error) {
      console.error('Error creating guest:', error);
      res.status(500).json({ error: 'Failed to create guest' });
    }
  }
);

// PUT update guest
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
      const guest = await Guest.update(parseInt(req.params.id), req.body);
      if (!guest) {
        return res.status(404).json({ error: 'Guest not found' });
      }
      res.json(guest);
    } catch (error) {
      console.error('Error updating guest:', error);
      res.status(500).json({ error: 'Failed to update guest' });
    }
  }
);

// DELETE guest
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const deleted = await Guest.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

module.exports = router;
