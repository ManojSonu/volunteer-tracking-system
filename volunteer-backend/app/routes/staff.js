const express = require('express');
const router = express.Router();
const Volunteer = require('../models/volunteer');
const User = require('../models/user');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/images');
  },
  filename: function (req, file, callback) {
    console.log('storage', file);
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname + '.jpg');;
  }
});

router.post('/:id/update-volunteer', (req, res) => {
  const userId = req.params.id;
  console.log('req.decoded', req.decoded);
  console.log(userId)
  User.findOne({ $or: [{ phone: userId }, { aadhar: userId }] }).then(user => {
    if (user) {
      const newVolunteer = new Volunteer({
        volunteer: user._id,
        dateOfParticipaion: req.body.dateOfParticipaion,
        daysToBeBlocked: req.body.daysToBeBlocked,
        lastSampleCollectionDate: req.body.lastSampleCollectionDate
      })
      newVolunteer.save().then(dbResponse => {
        const enrollBlockedDays = checkIsEnrollBlocked([dbResponse]) || 0;
        if (!dbResponse.errors) {
          return res.status(200).json({
            success: true,
            data: dbResponse,
            enrollBlockedDays
          })
        }
      }).catch(err => {
        return res.status(400).json({
          errors: {
            message: err.message
          }
        })
      })
    } else {
      throw {
        message: 'user not found'
      }
    }
  }).catch(err => {
    res.status(400).json({
      errors: {
        message: err.message
      }
    })
  })

});

router.post('/:id/add-volunteer-photo', (req, res) => {
  console.log('add-volunteer-photo1', req.params);
  const userId = req.params.id;
  User.findOne({ $or: [{ phone: userId }, { aadhar: userId }] }).then(user => {
    if (user) {
      console.log('file received');
      const upload = multer({
        storage: storage
      }).single('file');

      upload(req, res, function (err) {
        if (err) {
          res.send({
            success: false,
            error: 'Error uploading file.',
            err
          });
        } else {
          return res.send({
            success: true
          })
        }
      });
    } else {
      throw {
        message: 'user not found'
      }
    }
  }).catch(err => {
    res.status(400).json({
      errors: {
        message: err.message
      }
    })
  });
});

router.get('/:id/userdata', (req, res) => {
  const userId = req.params.id;
  const user = User.findOne({ $or: [{ phone: userId }, { aadhar: userId }] });
  user.then(dbResponse => {
    if (!dbResponse) {
      return res.status(200).json({
        success: true,
        message: 'User not found'
      })
    } else {
      Volunteer.find({ volunteer: dbResponse._id }).sort({ lastSampleCollectionDate: -1 })
        .then(volunteerDetails => {
          if (volunteerDetails) {
            const { aadhar, name, phone, type } = dbResponse;
            const enrollBlockedDays = checkIsEnrollBlocked(volunteerDetails) || 0;
            return res.status(200).json(
              {
                user: { aadhar, name, phone, type },
                data: volunteerDetails,
                enrollBlockedDays
              });
          } else {
            throw {
              message: 'No Volunteer found!'
            }
          }
        })
        .catch(errors => res.status(400).json({ errors }))
    }
  })
    .catch(errors => res.status(400).json({ errors }));
});

function checkIsEnrollBlocked(volunteerData) {
  const enrollBlocked = [];
  for (let i = 0; i < volunteerData.length; i++) {
    const data = volunteerData[i];
    const date = Date.now();
    const sampleCollectedOn = (new Date(data.lastSampleCollectionDate)).getTime();
    const diff = Math.floor((date - sampleCollectedOn) / 1000 / 60 / 60 / 24);
    enrollBlocked.push(data.daysToBeBlocked > diff ? data.daysToBeBlocked - diff : 0);
  }
  enrollBlocked.sort();
  return enrollBlocked[enrollBlocked.length - 1];
}


module.exports = router;