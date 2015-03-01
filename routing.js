var config = require('./config');
var model = require('./model');
var forecastUtil = require('./forecast-util');
var realtime = require('./realtime');
var app = require('./app');

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
        model.Advertising.find({}, function (err, advs) {
            model.Meeting.find({}).sort({created_at: -1}).exec(function (err, meetings) {
                res.render('front', {
                    ws_addr: ws_addr,
                    company_name: setting.value,
                    advs: advs,
                    meetings: meetings
                });
            });
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
};

exports.addAdvertisingProcessRoute = function (req, res) {

    var adv = req.body;

    new model.Advertising(adv).save(function (err, adv) {

        console.log(adv);
        realtime.refresh(app.socket);
        res.redirect('/advertising/list');
    });
};

exports.addAdvertisingRoute = function (req, res) {

    res.render('advertising_add');
};

exports.listAdvertisingRoute = function (req, res) {

    model.Advertising.find({}, function (err, advs) {

        console.log(advs);

        res.render('advertising_list', {advs: advs});
    });

};

exports.deleteAdvertisingRoute = function (req, res) {

    model.Advertising.findOneAndRemove({_id: req.params._id}, function (err) {

        res.redirect('/advertising/list');
    });
};

exports.updateAdvertisingRoute = function (req, res) {

    model.Advertising.findOne({_id: req.params._id}, function (err, ad) {

        console.log(ad);

        res.render('advertising_update', {ad: ad});
    });
};

exports.updateAdvertisingProcessRoute = function (req, res) {

    var newad = req.body;

    model.Advertising.findOne({_id: newad.advertising_id}, function (err, ad) {

        ad.html_content = newad.html_content;
        ad.adv_name = newad.adv_name;
        ad.save(function(err, ad) {
            console.log(ad);
            realtime.refresh(app.socket);
            res.redirect('/advertising/list');
        });
    });
};