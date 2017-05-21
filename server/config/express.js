var express = require('express'); 
var bodyParser = require('body-parser');  
var path = require('path');
//var busboyBodyParser = require('busboy-body-parser');

var app = express();

var bodyParser = require('body-parser');//This is a body-parsing middleware that is used to parse the request 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(path.normalize(__dirname + '/../..'), 'www')));
app.set('appPath', 'www');
//app.use(busboyBodyParser());

require('./morgan.js')(app); //This is an HTTP request logger middleware.
require('./routes.js')(app); //This is an Route middleware.

exports.app = app;