const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
});

passport.use('login',
  new LocalStrategy({ usernameField: 'phone'}, (user, password, done) => {
    User.findOne({$or: [{phone: user}, {aadhar: user}]})
      .then(user => {
        if(!user) {
          done(null, false, { message: 'Email/Password Mismatch'});
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            return isMatch ? done(null, user) : done(null, false, { message: 'Wrong Password'});
          }); // bcrypt.compare
        } // if else User
      })
      .catch(err => {
        return done(null, false, {message: err})
      });
  })
);

module.exports = passport;
