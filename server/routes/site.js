const express = require('express');
const { verifySitePassword } = require('../middleware/sitePassword');

const router = express.Router();

router.post('/verify-password', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const isValid = await verifySitePassword(password);

    if (isValid) {
      req.session.siteAccessGranted = true;
      res.json({ success: true, message: 'Access granted' });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Site password verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.get('/check-access', (req, res) => {
  res.json({
    hasAccess: req.session && req.session.siteAccessGranted === true
  });
});

module.exports = router;
