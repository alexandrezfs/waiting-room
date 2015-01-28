var model = require('./model');
var moment = require('moment');

exports.newMeeting = function (meeting, socket) {

    var newMeeting = new model.Meeting(meeting);

    newMeeting.save(function (err, savedMeeting) {
        console.log(savedMeeting);
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

exports.removeMeeting = function(socket, _id) {

    model.Meeting.findOne({_id: _id}).remove(function(err) {

        console.log("Entity removed !");

        meetingList(socket);
        meetingListToday(socket);

    });

};

exports.updateMeeting = function(socket, _id, updatedMeeting) {

    model.Meeting.update({_id: _id}, updatedMeeting, null, function(err) {

        console.log("Entity removed !");

        meetingList(socket);
        meetingListToday(socket);

    });
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