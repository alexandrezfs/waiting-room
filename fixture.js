var config = require('./config');
var model = require('./model');

exports.registerAdminUser = function () {

    var admin_user = config.values.admin_user;

    model.User.findOne({username: admin_user.username}, function (err, user) {

        if (!user) {

            var newUser = new model.User(admin_user);
            newUser.save(function (err, savedUser) {
                console.log("User saved !");
                console.log(savedUser);
            });
        }
    });

};

exports.registerCompanyName = function () {

    var company_name = config.values.company_name;

    var settingValues = {
        key: 'company_name',
        value: company_name
    };

    model.Setting.findOne({key: 'company_name'}, function (err, setting) {

        if (!setting) {

            var settingEntity = new model.Setting(settingValues);
            settingEntity.save(function (err, savedSetting) {
                console.log("Setting saved !");
                console.log(savedSetting);
            });

        }
    });
};