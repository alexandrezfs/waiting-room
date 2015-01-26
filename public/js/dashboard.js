var socket = io.connect($("#ws_addr").val(), {transports: ['websocket', 'polling', 'flashsocket']});

$(document).ready(function() {

    socket.on("meeting-list", function(meetings) {

        initMeetingList(meetings);

        var dynatable = $('#meetingList').data('dynatable');
        dynatable.records.updateFromJson({records: meetings});
        dynatable.records.init();
        dynatable.process();
    });

    socket.emit('meeting-list');

    $("#meetingDatetime").datetimepicker();

    $("#addBtn").click(function() {

        var formValues = {
            clientFirstname : $("#clientFirstname").val(),
            clientLastname : $("#clientLastname").val(),
            meetingReason : $("#meetingReason").val(),
            meetingDatetime : moment($("#meetingDatetime").val(), "YYYY/MM/DD h:mm").toDate()
        };

        var isFormValid = true;

        Object.keys(formValues).forEach(function(key) {

            var value = formValues[key];

            if(value == null || value.length == 0) {
                isFormValid = false;
            }

        });

        if(isFormValid) {
            socket.emit('newMeeting', formValues);
            $("#clientFirstname").val("");
            $("#clientLastname").val("");
            $("#meetingReason").val("");
            $("#meetingDatetime").val("");

        }
        else {
            sweetAlert("Oops...", "A field is missing", "error");
        }

        return false;

    });

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