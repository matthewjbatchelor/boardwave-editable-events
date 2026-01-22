const { query } = require('../config/database');
const bcrypt = require('bcrypt');

async function requireSitePassword(req, res, next) {
  // Allow static assets and site password routes without authentication
  if (
    req.path.startsWith('/css/') ||
    req.path.startsWith('/js/') ||
    req.path.startsWith('/images/') ||
    req.path.startsWith('/uploads/') ||
    req.path === '/api/site/verify-password' ||
    req.path === '/api/site/check-access'
  ) {
    return next();
  }

  // Check if site access is granted in session
  if (req.session && req.session.siteAccessGranted) {
    return next();
  }

  // For API routes, return 401
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Site access required', requiresSitePassword: true });
  }

  // For HTML pages, allow through (frontend will handle the password overlay)
  next();
}

async function verifySitePassword(password) {
  try {
    const result = await query(
      "SELECT value FROM site_settings WHERE key = 'site_password'"
    );

    if (result.rows.length === 0) {
      return false;
    }

    const hashedPassword = result.rows[0].value;
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying site password:', error);
    return false;
  }
}

module.exports = { requireSitePassword, verifySitePassword };
