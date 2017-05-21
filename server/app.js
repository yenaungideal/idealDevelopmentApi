"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/environment');
var app = require('./config/express.js').app;
require('./config/mongo.js');
require('./model');
require('./scheduledTask/index.js');
require('./config/passport.js');
// require('./config/winston.js');
// require('./config/sequelize.js');


var server;
if (config.ishttps) {
    const fs = require('fs');

    //convert passphrase from base64 to string
    var passphrase = new Buffer(config.httpsPassphrase, 'base64').toString('ascii');

    const options = {
        pfx: fs.readFileSync(config.httpsPfxLoc),
        passphrase: passphrase
    };

    server = require('https').createServer(options, app);

} else {

    server = require('http').createServer(app);

}

require('http').createServer(app);

server.listen(config.port, function() {
    var port = server.address().port;
    console.log('Application running in \'%s\' mode and listening at port \'%s\'', process.env.NODE_ENV, port);
});

module.exports = server;






















// 'use strict';

// var express = require('express'); 
// var path = require('path');

// var app = express();

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.use(express.static(path.join(path.normalize(__dirname + '/..'), 'www')));
// app.set('appPath', 'www');
 
//   app.route('/*')
//     .get(function(req, res) {
//     	console.log(__dirname);
// res.sendFile(path.join(path.normalize(__dirname + '/..'), 'www//index.html')); 
      
//     });
  
 
// var server = require('http').createServer(app);

// server.listen(3002, function () {
//   var port = server.address().port;
//   console.log('Example app listening at port %s', port);
// });

// module.exports = server;