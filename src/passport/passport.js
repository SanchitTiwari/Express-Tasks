const passport = require('passport');
var LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
const { deserialize } = require('mongodb');
var User = mongoose.model('User');

//Local strategy of PassportJS Login Authentication

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


// Serialize user by storing userId in user object
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user by retrieving user information associated with the userId 
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});
