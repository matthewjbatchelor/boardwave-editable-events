const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Guest = require('../models/Guest');
const Speaker = require('../models/Speaker');
const Host = require('../models/Host');
const ScheduleItem = require('../models/ScheduleItem');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all events (admin only)
router.get('/', ensureAdmin, async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event by ID or slug with all related data
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let event;

    // Try to parse as ID first
    const id = parseInt(idOrSlug);
    if (!isNaN(id)) {
      event = await Event.findById(id);
    }

    // If not found by ID, try slug
    if (!event) {
      event = await Event.findBySlug(idOrSlug);
    }

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get all related data
    const [guests, speakers, hosts, schedule] = await Promise.all([
      Guest.findByEventId(event.id),
      Speaker.findByEventId(event.id),
      Host.findByEventId(event.id),
      ScheduleItem.findByEventId(event.id)
    ]);

    res.json({
      ...event,
      guests,
      speakers,
      hosts,
      schedule
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST create new event
router.post('/',
  ensureAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const event = await Event.create(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  }
);

// PUT update event
router.put('/:id',
  ensureAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const event = await Event.update(parseInt(req.params.id), req.body);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  }
);

// DELETE event
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    const deleted = await Event.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Duplicate an event
router.post('/:id/duplicate', ensureAdmin, async (req, res) => {
  try {
    const sourceEvent = await Event.findById(parseInt(req.params.id));
    if (!sourceEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Create new event with copied data
    const newEventData = {
      ...sourceEvent,
      title: `${sourceEvent.title} (Copy)`,
      slug: `${sourceEvent.slug}-copy-${Date.now()}`,
      isPublished: false
    };
    delete newEventData.id;
    delete newEventData.createdAt;
    delete newEventData.updatedAt;

    const newEvent = await Event.create(newEventData);

    // Copy related data
    const [guests, speakers, hosts, schedule] = await Promise.all([
      Guest.findByEventId(sourceEvent.id),
      Speaker.findByEventId(sourceEvent.id),
      Host.findByEventId(sourceEvent.id),
      ScheduleItem.findByEventId(sourceEvent.id)
    ]);

    // Create copies of related data
    await Promise.all([
      ...guests.map(g => Guest.create({ ...g, eventId: newEvent.id, id: undefined })),
      ...speakers.map(s => Speaker.create({ ...s, eventId: newEvent.id, id: undefined })),
      ...hosts.map(h => Host.create({ ...h, eventId: newEvent.id, id: undefined })),
      ...schedule.map(s => ScheduleItem.create({ ...s, eventId: newEvent.id, id: undefined }))
    ]);

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error duplicating event:', error);
    res.status(500).json({ error: 'Failed to duplicate event' });
  }
});

module.exports = router;
