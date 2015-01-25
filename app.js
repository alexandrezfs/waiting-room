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

app.listen(config.values.server_port, function() {
    console.log("server started on port " + config.values.server_port);
    fixture.registerAdminUser();
});