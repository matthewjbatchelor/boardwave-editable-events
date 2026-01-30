const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection pool settings for better reliability
  max: 10,                      // Maximum number of connections
  min: 2,                       // Minimum number of connections
  idleTimeoutMillis: 30000,     // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout after 10 seconds when connecting
  keepAlive: true,              // Keep connections alive
  keepAliveInitialDelayMillis: 10000
});

// Handle pool errors to prevent crashes
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

// Query wrapper with retry logic
async function queryWithRetry(text, params, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      if (attempt === retries || !isRetryableError(err)) {
        throw err;
      }
      console.log(`Database query failed (attempt ${attempt}/${retries}), retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

function isRetryableError(err) {
  // Retry on connection errors, not on query/data errors
  const retryableCodes = ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', '57P01', '57P02', '57P03'];
  return retryableCodes.includes(err.code) || err.message?.includes('Connection terminated');
}

module.exports = {
  query: queryWithRetry,
  pool
};
