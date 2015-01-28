var express = require('express');
var routing = require('./routing');
var app = express();
var passport = require('passport');
var passportUtil = require('./passport-util');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var config = require('./config');
var fixture = require('./fixture');
var http = require('http').Server(app);
var realtime = require('./realtime');
var io = require('socket.io').listen(3001);

io.set('transports', [
    'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
]);

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Content-Range, Content-Disposition, Content-Description');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// required for passport
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(flash());

app.set('view engine', 'ejs');

passport.serializeUser(passportUtil.serializeUser);
passport.deserializeUser(passportUtil.deserializeUser);
passport.use(new LocalStrategy(
    passportUtil.strategy
));


app.get('/', routing.indexRoute);
app.get('/dashboard', routing.dashboardRoute);
app.get('/front', routing.frontRoute);
app.post('/login',
    passport.authenticate('local', {failureRedirect: '/', failureFlash: true}),
    function (req, res) {
        res.redirect('/dashboard');
    });
app.get('/logout', routing.logoutRoute);
app.get('/meeting/:_id', routing.getMeetingByIdRoute);

app.listen(config.values.server_port, function() {
    console.log("server started on port " + config.values.server_port);
    fixture.registerAdminUser();
});

io.sockets.on('connection', function(socket){

    socket.on('newMeeting', function(meeting) {
        realtime.newMeeting(meeting, socket);
    });
    socket.on('meeting-list', function() {
        realtime.meetingList(socket);
    });
    socket.on('meeting-list-today', function() {
        realtime.meetingListToday(socket);
    });
    socket.on('meeting-update', function(data) {
        realtime.updateMeeting(socket, data._id, data.updatedMeeting);
    });
    socket.on('meeting-remove', function(data) {
        realtime.removeMeeting(socket, data._id);
    });

});