const express = require('express');
const router = express.Router();
const Volunteer = require('../models/volunteer');

router.get('/', (req, res) => {
    const volunteerId = req.decoded.user.id;
    console.log(req.decoded.user.id);
    Volunteer.find({ volunteer: volunteerId})
        .then(volunteerData => {
            const data = volunteerData && volunteerData.map(itm => {
                return ({
                    dateOfParticipaion: itm.dateOfParticipaion,
                    daysToBeBlocked: itm.daysToBeBlocked,
                    lastSampleCollectionDate: itm.lastSampleCollectionDate
                })
            })
            return res.status(200).json({
                success: true,
                data: data || []
            });
        })
        .catch(error => res.status(400).json({ error }));
});

module.exports = router;