function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
}

function ensureViewer(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === 'viewer' || req.user.role === 'admin')) {
    return next();
  }
  res.status(403).json({ error: 'Viewer access required' });
}

module.exports = { ensureAuthenticated, ensureAdmin, ensureViewer };
