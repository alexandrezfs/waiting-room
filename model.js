var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect('mongodb://localhost/' + config.values.mongo_db_name);

var UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

exports.User = mongoose.model('User', UserSchema);