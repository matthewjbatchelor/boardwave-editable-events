const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('./database');
require('dotenv').config();

const sessionStore = new pgSession({
  pool: pool,
  tableName: 'session',
  createTableIfMissing: true,
  pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
  errorLog: (err) => {
    console.error('Session store error:', err);
  }
});

// Handle session store errors
sessionStore.on('error', (err) => {
  console.error('Session store connection error:', err);
});

const sessionConfig = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'events-cms-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
  },
  name: 'events.sid'
};

module.exports = sessionConfig;
