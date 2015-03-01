var socket = io.connect($("#ws_addr").val(), {transports: ['websocket', 'polling', 'flashsocket']});

$(document).ready(function() {

    initDatetimePickers();
    socket.on("meeting-list", listMeetings);
    socket.emit('meeting-list');
    $("#addBtn").click(clickAddBtn);
    $("#updBtn").click(updateMeeting);
    $("#delBtn").click(deleteMeeting);

});

function listMeetings(meetings) {

    initMeetingList(meetings);

    var dynatable = $('#meetingList').data('dynatable');
    dynatable.records.updateFromJson({records: meetings});
    dynatable.records.init();
    dynatable.process();

}

function clickAddBtn() {

    validateForm('add', function(response, formValues) {

        if(response) {

            $("#clientFirstname").val("");
            $("#clientLastname").val("");
            $("#meetingReason").val("");
            $("#meetingDatetime").val("");

            socket.emit('newMeeting', formValues);
        }
        else {
            sweetAlert("Oops...", "A field is missing", "error");
        }

    });

    return false;

}

function validateForm(formType, callback) {

    var formValues = {};

    if(formType == "add") {

        formValues = {
            clientFirstname : $("#clientFirstname").val(),
            clientLastname : $("#clientLastname").val(),
            meetingReason : $("#meetingReason").val(),
            meetingDatetime : moment($("#meetingDatetime").val(), "YYYY/MM/DD h:mm").toDate(),
            meetingStatus: $("#meetingStatus").val()
        };

    }
    else if(formType == "update") {

        formValues = {
            clientFirstname : $("#clientFirstnameUpdate").val(),
            clientLastname : $("#clientLastnameUpdate").val(),
            meetingReason : $("#meetingReasonUpdate").val(),
            meetingDatetime : moment($("#meetingDatetimeUpdate").val(), "YYYY/MM/DD h:mm").toDate(),
            meetingStatus: $("#meetingStatusUpdate").val()
        };

    }

    var isFormValid = true;

    Object.keys(formValues).forEach(function(key) {

        var value = formValues[key];

        if(value == null || value.length == 0) {
            isFormValid = false;
        }

    });

    if(isFormValid) {
        callback(true, formValues);
    }
    else {
        callback(false, formValues);
    }

}

function initMeetingList(meetings) {

    $('#meetingList').dynatable({
        dataset: {
            records: meetings
        },
        writers: {
            'meetingDatetime': function (el, record) {
                var convertedDate = moment(el.meetingDatetime).format("LLL");
                return convertedDate;
            },
            'actions': function (el, record) {
                return '<a href="#" onclick="openUpdateModal(\'' + el._id + '\');"><span class="glyphicon glyphicon-eye-open"></span></a>';
            },
            'meetingStatus': function(el, record) {

                var status = el.meetingStatus;

                if(status == 'repairing') {
                    return buttons.repairing;
                }
                else if(status == 'pending') {
                    return buttons.pending;
                }
                else if(status == 'finished') {
                    return buttons.finished;
                }
                else {
                    return status;
                }
            }
        }
    });
}
function openUpdateModal(_id) {

    $.get('/api/meeting/' + _id, function(meeting) {

        $('#updateModalLabel').text(meeting.clientFirstname + ' ' + meeting.clientLastname);
        $('#meetingIdUpdate').val(meeting._id);
        $('#clientFirstnameUpdate').val(meeting.clientFirstname);
        $('#clientLastnameUpdate').val(meeting.clientLastname);
        $('#meetingReasonUpdate').val(meeting.meetingReason);
        $('#meetingDatetimeUpdate').val(moment(meeting.meetingDatetime).format('YYYY/MM/DD HH:mm'));
        $('#meetingStatusUpdate').val(meeting.meetingStatus);

        $('#updateModal').modal('show');
    });

    return false;
}
function updateMeeting() {

    validateForm('update', function(response, formValues) {

        if(response) {

            socket.emit('meeting-update', {
                _id: $("#meetingIdUpdate").val(),
                updatedMeeting: formValues
            });

            $('#updateModal').modal('hide');
            sweetAlert("Updated", "Meeting updated !", "success");
        }
        else {
            sweetAlert("Oops...", "A field is missing", "error");
            $('#updateModal').modal('hide');
        }

    });

}
function deleteMeeting() {

    socket.emit('meeting-remove', {_id: $("#meetingIdUpdate").val()});

    $('#updateModal').modal('hide');
    sweetAlert("Deleted", "Meeting deleted !", "success");
}
function initDatetimePickers() {
    $("#meetingDatetime").datetimepicker();
    $("#meetingDatetimeUpdate").datetimepicker();
}