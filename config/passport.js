const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const { validatePassword } = require('../lib/passwordUtils');
const User = require("../models/user");



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});


  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };

        const isValid = validatePassword(password, user.hash);

        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        
      } catch(err) {
        return done(err);
      };
    })
  );
  

  module.exports = passport;