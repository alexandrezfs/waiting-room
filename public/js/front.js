var socket = io.connect($("#ws_addr").val(), {transports: ['websocket', 'polling', 'flashsocket']});

$(document).ready(function() {

    socket.on("meeting-list-today", listMeetings);
    socket.emit('meeting-list-today');

});

function initMeetingList(meetings) {
    $('#meetingList').dynatable({
        dataset: {
            records: meetings
        },
        writers: {
            'meetingDatetime': function (el, record) {
                var convertedDate = moment(el.meetingDatetime).format("h:mm");
                return convertedDate;
            },
            'meetingStatus': function(el, record) {

                var status = el.meetingStatus;

                if(status == 'departure') {
                    return '<button class="btn btn-primary btn-sm" type="button">Departure</button>';
                }
                else if(status == 'pending') {
                    return '<button class="btn btn-success btn-sm" type="button">Pending</button>';
                }
                else if(status == 'arrival') {
                    return '<button class="btn btn-danger btn-sm" type="button">Arrival</button>';
                }
                else {
                    return status;
                }
            }
        }
    });
};

function listMeetings(meetings) {

    initMeetingList(meetings);

    var dynatable = $('#meetingList').data('dynatable');
    dynatable.records.updateFromJson({records: meetings});
    dynatable.records.init();
    dynatable.paginationPerPage.set(20);
    dynatable.process();

}