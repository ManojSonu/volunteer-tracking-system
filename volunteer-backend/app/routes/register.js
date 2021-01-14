const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/', (req, res, next) => {
  const {
    aadhar,
    password,
    phone,
    name,
    address,
    type
  } = req.body;
  User.findOne({
      $or: [{
        aadhar: aadhar
      }, {
        phone: phone
      }]
    })
    .then(user => {
      if (!user) {
        const newUser = new User({
          aadhar,
          password,
          phone,
          name,
          type,
          address
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                return res.status(200).json({
                  success: true,
                  user
                });
              })
              .catch(err => {
                return res.status(400).json({
                  message: err
                })
              }); // newUser
          }); // bcrypt.hash
        }); // bcrypt.genSalt
      } else {
        return res.status(400).json({
          errors: {
            message: 'Phone/Aadhar already exists!'
          }
        })
      }
    })
});

module.exports = router;