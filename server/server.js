const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import configurations
const sessionConfig = require('./config/session');
const passport = require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const siteRoutes = require('./routes/site');
const eventsRoutes = require('./routes/events');
const guestsRoutes = require('./routes/guests');
const speakersRoutes = require('./routes/speakers');
const hostsRoutes = require('./routes/hosts');
const scheduleRoutes = require('./routes/schedule');
const uploadRoutes = require('./routes/upload');

// Import middleware
const { requireSitePassword } = require('./middleware/sitePassword');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Railway/cloud deployments
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.quilljs.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.quilljs.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"]
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../images')));

// API routes
app.use('/api/site', siteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/guests', guestsRoutes);
app.use('/api/speakers', speakersRoutes);
app.use('/api/hosts', hostsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/upload', uploadRoutes);

// Serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const errorResponse = {
    error: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { message: err.message })
  };
  res.status(err.status || 500).json(errorResponse);
});

// Database initialization
async function initializeDatabase() {
  const { query } = require('./config/database');
  const bcrypt = require('bcrypt');

  try {
    console.log('Initializing database...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('viewer', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    // Create events table
    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE,
        subtitle TEXT,
        event_date DATE,
        event_time TEXT,
        location TEXT,
        venue TEXT,
        hero_image TEXT,
        description TEXT,
        schedule_heading TEXT,
        schedule_intro TEXT,
        schedule_image TEXT,
        welcome_message TEXT,
        signature TEXT,
        contact_name TEXT,
        contact_title TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        partner_name TEXT,
        partner_logo TEXT,
        partner_description TEXT,
        partner_website TEXT,
        testimonial_text TEXT,
        testimonial_author TEXT,
        testimonial_title TEXT,
        testimonial_company TEXT,
        testimonial_image TEXT,
        partner_hero_image TEXT,
        connect_intro TEXT,
        connect_instructions TEXT,
        connect_link TEXT,
        connect_image TEXT,
        is_published INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add new columns for schedule section (for existing databases)
    try {
      await query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS schedule_heading TEXT`);
      await query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS schedule_intro TEXT`);
      await query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS schedule_image TEXT`);
      await query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_hero_image TEXT`);
    } catch (e) {
      // Columns may already exist
    }

    // Create guests table
    await query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        name TEXT NOT NULL,
        title TEXT,
        company TEXT,
        bio TEXT,
        image TEXT,
        badge TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create speakers table
    await query(`
      CREATE TABLE IF NOT EXISTS speakers (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        name TEXT NOT NULL,
        title TEXT,
        company TEXT,
        bio TEXT,
        image TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create hosts table
    await query(`
      CREATE TABLE IF NOT EXISTS hosts (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        name TEXT NOT NULL,
        title TEXT,
        company TEXT,
        bio TEXT,
        image TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create schedule_items table
    await query(`
      CREATE TABLE IF NOT EXISTS schedule_items (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        time TEXT NOT NULL,
        description TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create session table
    await query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      ) WITH (OIDS=FALSE);
    `);
    await query(`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");`);

    // Create site_settings table
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_guests_event ON guests(event_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_speakers_event ON speakers(event_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_hosts_event ON hosts(event_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_schedule_event ON schedule_items(event_id);`);

    console.log('Database tables created');

    // Create default users if they don't exist
    const User = require('./models/User');

    const adminExists = await User.findByUsername(process.env.ADMIN_USERNAME || 'admin');
    if (!adminExists) {
      await User.create(
        process.env.ADMIN_USERNAME || 'admin',
        process.env.ADMIN_PASSWORD || 'admin123',
        'admin'
      );
      console.log('Admin user created');
    }

    // Set default site password
    const sitePasswordResult = await query(
      "SELECT value FROM site_settings WHERE key = 'site_password'"
    );
    if (sitePasswordResult.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('B04rdw4ve!', 12);
      await query(
        `INSERT INTO site_settings (key, value) VALUES ('site_password', $1)`,
        [hashedPassword]
      );
      console.log('Site password configured');
    }

    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Start server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`\nServer running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\nAdmin login: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`\nPress Ctrl+C to stop\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down...');
  process.exit(0);
});
