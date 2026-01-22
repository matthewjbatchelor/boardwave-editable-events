const express = require('express');
const { body, validationResult } = require('express-validator');
const ScheduleItem = require('../models/ScheduleItem');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

// GET schedule items by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const items = await ScheduleItem.findByEventId(parseInt(req.params.eventId));
    res.json(items);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// GET single schedule item
router.get('/:id', async (req, res) => {
  try {
    const item = await ScheduleItem.findById(parseInt(req.params.id));
    if (!item) {
      return res.status(404).json({ error: 'Schedule item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching schedule item:', error);
    res.status(500).json({ error: 'Failed to fetch schedule item' });
  }
});

// POST create schedule item
router.post('/',
  ensureAdmin,
  [
    body('eventId').isInt().withMessage('Event ID is required'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const item = await ScheduleItem.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating schedule item:', error);
      res.status(500).json({ error: 'Failed to create schedule item' });
    }
  }
);

// PUT update schedule item
router.put('/:id',
  ensureAdmin,
  [
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const item = await ScheduleItem.update(parseInt(req.params.id), req.body);
      if (!item) {
        return res.status(404).json({ error: 'Schedule item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error updating schedule item:', error);
      res.status(500).json({ error: 'Failed to update schedule item' });
    }
  }
);

// DELETE schedule item
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const deleted = await ScheduleItem.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Schedule item not found' });
    }
    res.json({ message: 'Schedule item deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    res.status(500).json({ error: 'Failed to delete schedule item' });
  }
});

module.exports = router;
