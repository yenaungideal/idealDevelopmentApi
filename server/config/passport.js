var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var config = require('../config/environment');
var svrAuth = require('../service/userManagement/auth').verify;

passport.use(new LocalStrategy(
    {
        usernameField : 'user',
        passwordField : 'password'
    },

    function (userID, password, done) {
        svrAuth.authenticate(userID, password, function (result) { 
            done(result);
        })
    })); 