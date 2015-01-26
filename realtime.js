var model = require('./model');
var moment = require('moment');

exports.newMeeting = function (meeting, socket) {

    var meeting = new model.Meeting(meeting);

    meeting.save(function (err, meeting) {
        console.log(meeting);
        meetingList(socket);
        meetingListToday(socket);
    });
};

exports.meetingList = function (socket) {
    meetingList(socket);
};

exports.meetingListToday = function (socket) {
    meetingListToday(socket);
};

var meetingList = function (socket) {

    model.Meeting.find({}).sort({created_at: -1}).exec(function (err, meetings) {
        console.log(meetings);
        socket.emit('meeting-list', meetings);
        socket.broadcast.emit('meeting-list', meetings);
    });

};

var meetingListToday = function (socket) {

    var today = moment().startOf('day'),
        tomorrow = moment(today).add(1, 'days'),
        limitDate = moment().subtract(2, 'hours');

    model.Meeting.find({
        meetingDatetime: {
            $gte: limitDate.toDate(),
            $lt: tomorrow.toDate()
        }
    }).sort({meetingDatetime: -1}).exec(function (err, meetings) {
        console.log(meetings);
        socket.emit('meeting-list-today', meetings);
        socket.broadcast.emit('meeting-list-today', meetings);
    });

};