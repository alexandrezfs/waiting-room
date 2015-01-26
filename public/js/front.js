var socket = io.connect($("#ws_addr").val(), {transports: ['websocket', 'polling', 'flashsocket']});

$(document).ready(function() {

    socket.on("meeting-list", function(meetings) {

        initMeetingList(meetings);

        var dynatable = $('#meetingList').data('dynatable');
        dynatable.records.updateFromJson({records: meetings});
        dynatable.records.init();
        dynatable.paginationPerPage.set(20);
        dynatable.process();
    });

    socket.emit('meeting-list');

});

function initMeetingList(meetings) {
    $('#meetingList').dynatable({
        dataset: {
            records: meetings
        },
        writers: {
            'meetingDatetime': function (el, record) {
                var dateStr = el.innerHtml;
                var convertedDate = moment(dateStr).format("LLL");
                return convertedDate;
            }
        }
    });
};