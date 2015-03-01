var socket = io.connect($("#ws_addr").val(), {transports: ['websocket', 'polling', 'flashsocket']});

$(document).ready(function() {
    socket.on("meeting-list-today", listMeetings);
    socket.on("refresh", refresh);
});

function listMeetings() {
    console.log('Called!');
    document.location.href =  document.location.href;
    getWeather();
};

function refresh() {
    document.location.href =  document.location.href;
};

function getWeather() {

    $.get('/api/weather', function(data) {

        var icon = data.currently.icon;
        var temperature = data.currently.temperature;

        $('#weatherTemperature').text(Math.round(temperature) + '°C');

        var skycons = new Skycons({"color": "#3498db"});
        skycons.add("weatherIcon", icon);
        skycons.play();
    });
};

setInterval(function() {
    $('#showTime').text(moment().locale('fr').format('LLLL'));
}, 1000);

setInterval(function() {
    document.location.href =  document.location.href;
}, 36000000);
