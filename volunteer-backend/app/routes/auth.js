const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/', (req, res, next) => {
  passport.authenticate('login', function (err, user, info) {
    if (err) {
      return res.status(400).json({
        errors: err
      });
    }
    if (!user) {
      return res.status(400).json({
        errors: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({
          errors: err
        });
      }
      const body = {
        id: user._id,
        aadhaar: user.aadhaar,
        phone: user.phone,
        name: user.name,
        type: user.type
      };
      const token = jwt.sign({
        user: body,
      }, config.secret, {
        expiresIn: '24h'
      });
      return res.status(200).json({
        success: true,
        token
      });
    });
  })(req, res, next);
});

module.exports = router;