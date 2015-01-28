var config = require('./config');
var model = require('./model');

exports.registerAdminUser = function() {

    var admin_user = config.values.admin_user;

    model.User.findOne({username: admin_user.username}, function(err, user) {

        if(!user) {

            var newUser = new model.User(admin_user);
            newUser.save(admin_user, function(err, savedUser) {
                console.log("User saved !");
                console.log(savedUser);
            });
        }
    });

};