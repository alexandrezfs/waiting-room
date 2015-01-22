var express = require('express');
var routing = require('./routing');
var model = require('./model');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', routing.indexRoute);
app.get('/loginProcess', routing.loginProcess);

var server = app.listen(3000);