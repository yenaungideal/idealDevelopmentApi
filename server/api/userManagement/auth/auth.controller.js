'use strict';
var passport = require('passport');
var Permission = require('../../../service/userManagement/permission');
var Auth = require('../../../service/userManagement/auth');

exports.aunthenticate = function (req, res, next) {
    //definition avail in ../service/userManagement/auth/auth.verify.service.js
    passport.authenticate('local', function (result) {
        //var token = auth.signToken(user._id, user.role);  
        if (!result) {
            res.status(500);
            res.send({ statusBool: false, message: "Something went worng" });
            return;
        }
        
        res.status(result.statusHttp);
        res.send(result);
    })(req, res, next)
};

exports.createLogoutHistory = function (req, res) {
    //definition avail in ../service/userManagement/auth/auth.verify.service.js
    Auth.verify.createLogoutHistory(req.body.userName, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.send(result);
    }
};

exports.getLogHistory = function (req, res) {
    Auth.verify.getLogHistory(req.body, processResult);
    function processResult(result) {
        res.json(result);
    }
};

