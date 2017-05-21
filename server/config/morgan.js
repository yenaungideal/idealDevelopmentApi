'use strict';

var config = require('../config/environment');
var morgan = require('morgan');
var mongoMorgan = require('mongo-morgan');

module.exports = function(app) {
    if (config.morgon.showInConsole) {
        app.use(morgan('dev'));
    }

    app.use(mongoMorgan(config.mongoDB.auditURL, ':date[iso]\t:method\t:status\t:response-time\t:url\t:user-agent\t:remote-addr\t:referrer }', {
        collection: 'httpLogs'
    }));

};
