const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findByUsername(username);

      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      const isValid = await User.validatePassword(password, user.password_hash);

      if (!isValid) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
