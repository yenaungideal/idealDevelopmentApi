'use strict';

var path = require('path');
module.exports = function (app) {

    app.use('/api/auth', require('../api/userManagement/auth'));
    app.use('/api/menu', require('../api/menu'));
    app.use('/api/userManagement/user', require('../api/userManagement/user'));
    app.use('/api/userManagement/permission', require('../api/userManagement/permission'));
    app.use('/api/userManagement/role', require('../api/userManagement/role'));
 
    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path.join(path.normalize(__dirname + '/../..'), 'www//index.html'));
        });

};
