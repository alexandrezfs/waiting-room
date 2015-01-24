var express = require('express');
var routing = require('./routing');
var model = require('./model');
var app = express();
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = passport.Strategy;


app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        // check in mongo if a user with username exists or not
        User.findOne({ 'username' :  username },
            function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log error & redirect back
                if (!user){
                    console.log('User Not Found with username '+username);
                    return done(null, false,
                        req.flash('message', 'User Not found.'));
                }
                // User exists but wrong password, log the error
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false,
                        req.flash('message', 'Invalid Password'));
                }
                // User and password both match, return user from
                // done method which will be treated like success
                return done(null, user);
            }
        );
    }));

app.get('/', routing.indexRoute);
app.get('/loginProcess', routing.loginProcess);

app.listen(3000);