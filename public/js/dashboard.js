var socket = io.connect('ws://localhost:3001', {transports: ['websocket', 'polling', 'flashsocket']});

$(document).ready(function() {

    $("#meetingDatetime").datetimepicker();

    $("#addBtn").click(function() {

        var formValues = {
            clientFirstname : $("#clientFirstname").val(),
            clientLastname : $("#clientLastname").val(),
            meetingReason : $("#meetingReason").val(),
            meetingDatetime : moment($("#meetingDatetime").val(), "YYYY/MM/DD h:mm").toDate()
        };

        console.log(formValues);

        var isFormValid = true;

        Object.keys(formValues).forEach(function(key) {

            var value = formValues[key];

            if(value == null || value.length == 0) {
                isFormValid = false;
            }

        });

        if(isFormValid) {
            socket.emit('newMeeting', formValues);
            sweetAlert("Saved", "You created a client meeting.", "success");
            $("#clientFirstname").val("");
            $("#clientLastname").val("");
            $("#meetingReason").val("");
            $("#meetingDatetime").val("");

        }
        else {
            sweetAlert("Oops...", "A field is missing", "error");
        }

    });

});