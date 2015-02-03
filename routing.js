var config = require('./config');
var model = require('./model');
var forecastUtil = require('./forecast-util');


exports.indexRoute = function (req, res) {

    res.render('index');
};

exports.dashboardRoute = function (req, res) {

    var ws_addr = config.values.ws_addr;

    res.render('dashboard', {
        ws_addr: ws_addr
    });

};

exports.frontRoute = function (req, res) {

    var ws_addr = config.values.ws_addr;

    model.Setting.findOne({key: 'company_name'}, function (err, setting) {
        res.render('front', {
            ws_addr: ws_addr,
            company_name: setting.value
        });
    });
};

exports.logoutRoute = function (req, res) {

    req.logout();
    res.redirect('/');
};

exports.getMeetingByIdRoute = function (req, res) {

    model.Meeting.findOne({_id: req.params._id}, function (err, meeting) {

        if (err) {
            res.json({message: "error"});
        }

        res.json(meeting);

    });
};

exports.weatherRoute = function (req, res) {

    forecastUtil.forecast.get(config.values.forecast_location, function (err, weather) {
        if (err) return console.dir(err);
        console.dir(weather);
        res.json(weather);
    });

};

exports.companyRoute = function (req, res) {

    model.Setting.findOne({key: 'company_name'}, function (err, setting) {
        res.render('company', {
            company_name: setting.value
        });
    });

};

exports.saveCompanyName = function (req, res) {

    var company_name = req.body.company_name;

    var settingValues = {
        key: 'company_name',
        value: company_name
    };

    model.Setting.update({key: 'company_name'}, settingValues, function (err, rowsAffected) {
        console.log(settingValues);
        res.json(settingValues);
    });

};

exports.loginRoute = function (req, res) {
    res.redirect('/dashboard');
}