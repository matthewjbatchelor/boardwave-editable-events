// Seed script to populate database with initial event data
require('dotenv').config();

const { query, pool } = require('./config/database');
const Event = require('./models/Event');
const Guest = require('./models/Guest');
const Speaker = require('./models/Speaker');
const Host = require('./models/Host');
const ScheduleItem = require('./models/ScheduleItem');
const { seedEvent, seedSchedule, seedHost, seedSpeakers, seedGuests } = require('./seedData');

async function seed() {
  console.log('Starting database seed...\n');

  try {
    // Check if event already exists
    const existingEvents = await Event.findAll();
    if (existingEvents.length > 0) {
      console.log('Database already has events. Skipping seed.');
      console.log('To reseed, delete existing events first.');
      process.exit(0);
    }

    // Create the event
    console.log('Creating event...');
    const event = await Event.create(seedEvent);
    console.log(`Created event: ${event.title} (ID: ${event.id})\n`);

    // Create schedule items
    console.log('Creating schedule items...');
    for (const item of seedSchedule) {
      await ScheduleItem.create({ ...item, eventId: event.id });
      console.log(`  - ${item.time}: ${item.description.substring(0, 50)}...`);
    }
    console.log(`Created ${seedSchedule.length} schedule items\n`);

    // Create host
    console.log('Creating host...');
    await Host.create({ ...seedHost, eventId: event.id });
    console.log(`  - ${seedHost.name}\n`);

    // Create speakers
    console.log('Creating speakers...');
    for (const speaker of seedSpeakers) {
      await Speaker.create({ ...speaker, eventId: event.id });
      console.log(`  - ${speaker.name}`);
    }
    console.log(`Created ${seedSpeakers.length} speakers\n`);

    // Create guests
    console.log('Creating guests...');
    for (const guest of seedGuests) {
      await Guest.create({ ...guest, eventId: event.id });
      console.log(`  - ${guest.name}`);
    }
    console.log(`Created ${seedGuests.length} guests\n`);

    console.log('Seed completed successfully!');
    console.log(`\nEvent URL: http://localhost:3000/event/${event.slug || event.id}`);

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
