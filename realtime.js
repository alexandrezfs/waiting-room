var model = require('./model');

exports.newMeeting = function(meeting) {

    var meeting = new model.Meeting(meeting);

    meeting.save(function(err, meeting) {
        console.log(meeting);
    });
};