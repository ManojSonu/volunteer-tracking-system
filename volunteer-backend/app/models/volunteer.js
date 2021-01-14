const mongoose = require('mongoose');
const { Schema } = mongoose;

const VolunteerSchema = new Schema({
    volunteer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOfParticipaion: Date,
    daysToBeBlocked: Number,
    lastSampleCollectionDate: Date,
    volunteerPhoto: String,
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = Volunteer = mongoose.model('volunteer', VolunteerSchema);