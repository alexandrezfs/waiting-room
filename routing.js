var config = require('./config');
var model = require('./model');

exports.indexRoute = function(req, res) {

    res.render('index');
};

exports.dashboardRoute = function(req, res) {

    var ws_addr = config.values.ws_addr;

    res.render('dashboard', {
        ws_addr: ws_addr
    });

};

exports.frontRoute = function(req, res) {

    var ws_addr = config.values.ws_addr;

    res.render('front', {
        ws_addr: ws_addr
    });
};

exports.logoutRoute = function(req, res) {

    req.logout();
    res.redirect('/');
};

exports.getMeetingByIdRoute = function(req, res) {

    model.Meeting.findOne({_id: req.params._id}, function(err, meeting) {

        if(err) {
            res.json({message: "error"});
        }

        res.json(meeting);

    });
};