const express = require('express');
const { body, validationResult } = require('express-validator');
const Host = require('../models/Host');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

// GET hosts by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const hosts = await Host.findByEventId(parseInt(req.params.eventId));
    res.json(hosts);
  } catch (error) {
    console.error('Error fetching hosts:', error);
    res.status(500).json({ error: 'Failed to fetch hosts' });
  }
});

// GET single host
router.get('/:id', async (req, res) => {
  try {
    const host = await Host.findById(parseInt(req.params.id));
    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }
    res.json(host);
  } catch (error) {
    console.error('Error fetching host:', error);
    res.status(500).json({ error: 'Failed to fetch host' });
  }
});

// POST create host
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
      const host = await Host.create(req.body);
      res.status(201).json(host);
    } catch (error) {
      console.error('Error creating host:', error);
      res.status(500).json({ error: 'Failed to create host' });
    }
  }
);

// PUT update host
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
      const host = await Host.update(parseInt(req.params.id), req.body);
      if (!host) {
        return res.status(404).json({ error: 'Host not found' });
      }
      res.json(host);
    } catch (error) {
      console.error('Error updating host:', error);
      res.status(500).json({ error: 'Failed to update host' });
    }
  }
);

// DELETE host
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const deleted = await Host.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Host not found' });
    }
    res.json({ message: 'Host deleted successfully' });
  } catch (error) {
    console.error('Error deleting host:', error);
    res.status(500).json({ error: 'Failed to delete host' });
  }
});

module.exports = router;
