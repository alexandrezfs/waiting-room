var config = require('./config');
var model = require('./model');

exports.registerAdminUser = function() {

    var admin_user = config.values.admin_user;

    model.User.findOne({username: admin_user.username}, function(err, user) {

        if(!user) {

            var user = new model.User(admin_user);
            user.save(admin_user, function(err, user) {
                console.log("User saved !");
                console.log(user);
            });
        }
    });

};