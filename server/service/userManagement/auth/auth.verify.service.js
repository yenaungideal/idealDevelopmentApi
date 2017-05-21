'use strict';
var UserModel = require('../../../model/userManagement/user/user.model').model;
var loginHistoryModel = require('../../../model/userManagement/loginHistory/loginHistory.model').model;
var config = require('../../../config/environment');
var svrUser = require('../user');
var svrSetting = require('../../administration/setting');
var svrPermission = require('../permission');
var _ = require('lodash');
var DateDiff = require('date-diff');

exports.authenticate = function(userName, Password, resultData) {
    // fetch user and verfiy password 
    UserModel.findOne({ name: new RegExp('^' + userName + '$', "i"), isActive: true })
        .then(userReadResponse)
        .catch(sendErrorResponse);

    var User;

    function userReadResponse(user) {
        if (user !== null) {
            //compare the password
            User = user;
            user.comparePassword(Password, comparePasswordResult);
        } else {
            //--createLoginHistory--//
            createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": false, "attemptDescription": "User account not registered" }, processResult);

            function processResult(res) {
                returnResponse(401, false, "User account not registered");
            }
        }
    }

    function createLoginHistory(option, result) {
        svrUser.create.createLogHistory(option, function() {
            result("Sucessfully save Logged History");
        });
    }

    function comparePasswordResult(err, isMatch) {
        console.log("************************error and isMatch Status*************************");
        console.log(err + " And " + isMatch);

        if (isMatch) {
            //console.log("---isMatch State True--");
            if (User.isLocked) {

                //console.log("---Locked--");
                //--createLoginHistory--//
                createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": false, "attemptDescription": "User account is locked" }, processResult);

                function processResult(res) {
                    returnResponse(401, false, "User account is locked");
                    return;
                }
            } else {
                //console.log("---Go--");
                updateLoginStatus(true);
            }
        } else {
            if (!isMatch) {
                //console.log("---isMatch State False--");
                //console.log(isMatch);

                if (User.isLocked) {
                    createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": false, "attemptDescription": "User account is locked" }, processResult);

                    function processResult(res) {
                        returnResponse(401, false, "User account is locked");
                        return;
                    }
                } else {
                    updateLoginStatus(false);
                    return;
                }

            }
            if (err) {
                sendErrorResponse(err);
            }
        }
    }

    function updateLoginStatus(isSucess) {
        var logCount = 0;
        var isLocked = false;
        var lastLocked;
        if (!isSucess) {
            logCount = User.invalidAttemptCount + 1;
        }

        if (logCount >= config.invalidLogInAttemptCount) {

            isLocked = true;
            lastLocked = new Date();
        }


        //locking if lastlogin > config.maxLoginDate
        if (User.lastLogin !== undefined && User.lastLogin !== null) {
            var curentDate = new Date();
            var lastLoginDate = User.lastLogin;

            var diff = new DateDiff(curentDate, lastLoginDate);

            if (diff.days() >= config.maxlockingDay) {
                var usr1 = {
                    _id: User._id,
                    isLocked: true,
                    lastLocked: new Date(),
                    pageStatus: "auth"
                }

                svrUser.update.updateRecord(usr1, function() {
                    //----createLoginHistory---//
                    createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": false, "attemptDescription": "User account is locked" }, processResult);

                    function processResult(res) {
                        returnResponse(401, false, "User account is locked");
                    }
                });
            } else {
                var usr2 = {
                    _id: User._id,
                    invalidAttemptCount: logCount,
                    isLocked: isLocked,
                    lastLocked: lastLocked,
                    pageStatus: "auth"
                }

                if (isSucess) {
                    usr2.lastLogin = new Date();
                }

                if (usr2.lastLocked === undefined) {
                    delete usr2.lastLocked;
                }
                svrUser.update.updateRecord(usr2, function() {
                    if (isSucess) {
                        //--createLoginHistory--//
                        createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": true, "attemptDescription": "Sucessfully Logged in" }, processResult);

                        function processResult(res) {

                            User.password = "";
                            User.oldPassword = null;
                            //get User Permissions
                            getPermissionsForUser();
                        }
                    } else {
                        //--createLoginHistory--//
                        //console.log("----break 1---");
                        createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": false, "attemptDescription": "User authentication failed", "attemptCount": logCount }, processResult);

                        function processResult(res) {
                            returnResponse(401, false, "User authentication failed");
                        }
                    }
                });
            }

        } else {
            var usr = {
                    _id: User._id,
                    invalidAttemptCount: logCount,
                    isLocked: isLocked,
                    lastLocked: lastLocked,
                    pageStatus: "auth"
                }
                //console.log("--usr--");
                //console.log(usr);

            if (isSucess) {
                usr.lastLogin = new Date();
            }

            if (usr.lastLocked === undefined) {
                delete usr.lastLocked;
            }
            svrUser.update.updateRecord(usr, function() {
                if (isSucess) {
                    //--createLoginHistory--//
                    createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": true, "attemptDescription": "Sucessfully Logged in" }, processResult);

                    function processResult(res) {

                        User.password = "";
                        User.oldPassword = null;
                        //get User Permissions
                        getPermissionsForUser();
                    }
                } else {
                    //--createLoginHistory--//
                    createLoginHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Login", "attemptResult": false, "attemptDescription": "User authentication failed", "attemptCount": logCount }, processResult);

                    function processResult(res) {
                        returnResponse(401, false, "User authentication failed");
                    }
                }
            });
        }
    }

    //Get Permissions for User acording to Role Assigned
    function getPermissionsForUser() {
        //get defalut Permissions
        var param = {
            key: "Permissions",
            isShowToUser: false
        };
        //getting default Permissions from settings
        svrSetting.read.getOneRecordByOptionName(param).then(function(res1) {
            if (res1 !== undefined && res1 !== null) {
                var defaultPermissions = JSON.parse(res1.value);
                //get user Permissions according to role assigned
                svrUser.role.updateRoleRecord(User).then(function(res2) {
                    if (res2 !== undefined && res2 !== null) {
                        var finalPermissions = _.merge(defaultPermissions, res2.data);
                        User.permissions = JSON.stringify(finalPermissions);
                        console.log("************************Final Permission*************************");
                        console.log(finalPermissions);
                        returnResponse(200, true, "Sucessfully Logged in", User);
                    } else {
                        User.permissions = JSON.stringify(defaultPermissions);
                        console.log("************************Final Permission*************************");
                        console.log(defaultPermissions);
                        returnResponse(200, true, "Sucessfully Logged in", User);
                    }
                });
            } else {
                //if settings doesnt contain permissions
                svrPermission.defaultCreate.defautCreateRecord().then(function(res1) {
                    if (res1.statusBool) {
                        //recreate settings - Permissions
                        getPermissionsForUser();
                    } else {
                        //If Permissions are not there 
                        User.permissions = null;
                        returnResponse(200, true, "Sucessfully Logged in", User);
                    }
                });
            }


        });
    }

    function sendErrorResponse(err) {
        returnResponse(500, false, "Something went worng");
    }

    function returnResponse(statusHttp, statusBool, message, data) {
        resultData({
            statusHttp: statusHttp,
            statusBool: statusBool,
            message: message,
            data: data
        });
    }

};

exports.createLogoutHistory = function(userName, resultData) {
    //--createLogoutHistory--//
    createLogoutHistory({ "name": userName, "attemptTime": new Date(), "attemptStatus": "Logout", "attemptResult": true, "attemptDescription": "Sucessfully Logged out" }, processResult);

    function processResult(res) {
        returnResponse(200, true, "Sucessfully Logged out");
    }

    function createLogoutHistory(option, result) {
        svrUser.create.createLogHistory(option, function() {
            result("Sucessfully save Logged out History");
        });
    }

    function returnResponse(statusHttp, statusBool, message, data) {
        resultData({
            statusHttp: statusHttp,
            statusBool: statusBool,
            message: message,
            data: data
        });
    }
};

exports.getLogHistory = function(option, resultData) {
    var obj = {};
    if (option.fromDate !== undefined && option.toDate !== undefined) {

        loginHistoryModel.find({ "attemptTime": { '$gte': option.fromDate, '$lt': option.toDate } }).exec(processResult);
    } else if (option.fromDate === undefined && option.toDate === undefined) {

        loginHistoryModel.find().exec(processResult);
    } else if (option.fromDate === undefined) {

        loginHistoryModel.find({ "attemptTime": { '$lt': option.toDate } }).exec(processResult);
    } else if (option.toDate === undefined) {

        loginHistoryModel.find({ "attemptTime": { '$gte': option.fromDate } }).exec(processResult);
    }

    function processResult(err, logHistory) {
        resultData(logHistory);
    }
};
