var config = require('./config');

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