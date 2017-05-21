'use strict';
var UserModel = require('../../../model/userManagement/user/user.model').model;
var TemplateModel = require('../../../model/general/template.model').model;
var GeEmailModel = require('../../../model/general/email.model').model;
var logHistoryModel = require('../../../model/userManagement/loginHistory/loginHistory.model').model;
var ReadTemplate = require('../../general/template');
var Common = require('../../general/common/');
var ReadUser = require('./');

exports.createRecord = function (payLoad, resultData) {
    try {
        var response = {};
        var isValid = true;
        //Validations
        if (payLoad.name === "" || payLoad.name === undefined || payLoad.name.length === 0) {
            //Check User having name
            response.message = "Name is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
        }
        else if (payLoad.role === "" || payLoad.role === undefined || payLoad.role.length === 0) {
            //Check User having role
            response.message = "Role is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
        }
        else if (payLoad.email === "" || payLoad.email === undefined || payLoad.email.length === 0) {
            //Check User having email
            response.message = "Email is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
        }

        else if (payLoad.createdBy === "" || payLoad.createdBy === undefined || payLoad.createdBy.length === 0) {
            //Check User having role
            response.message = "CreatedBy is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
        }
        else {

            //Check for unique user name
            var option = { name: payLoad.name, isActive: true };
            ReadUser.read.getDuplicateRecord(option, processUniqueValidationForName);
        }
    }
    catch (err) {
        console.error(err);
    }

    function processUniqueValidationForName(result) {
        if (result !== null) {
            response.message = "User Name already exists";
            response.statusHttp = 409;
            response.statusBool = false;
            isValid = false;
        }
        else {
            isValid = true;
        }
        //Check for unique email
        validationForEmail();
    }

    function validationForEmail() {
        if (isValid) {
            var option = { email: payLoad.email, isActive: true };
            ReadUser.read.getOneRecord(option, processUniqueValidationForEmail);
        }
        else {
            processMessage(true);
        }

    }

    function processUniqueValidationForEmail(result) {
        if (result !== null) {
            response.message = "Email Address already exists";
            response.statusHttp = 409;
            response.statusBool = false;
            isValid = false;
        }
        else {
            isValid = true;
        }
        processRecord();
    }

    var cpassword;
    function processRecord() {
        if (isValid) {
            Common.read.passwordGenerate(processToPasswordEncryprion)
            function processToPasswordEncryprion(result) {
                cpassword = result;
                var option = { password: cpassword };
                Common.read.getEncryptionPassword(option, processMessageForPasswordEncryption);
            }
        }
        else {
            processMessage(true);
        }
    }

    function processMessageForPasswordEncryption(result) {
        sendEmail(payLoad.email, "Login Password Information", payLoad.name, cpassword)
        payLoad.password = result;
        payLoad.oldPassword = [];
        var user = new UserModel(payLoad);
        user.save(processMessage);
    }

    var glUsername;
    var glPassword;
    var glSubject;
    var glTo;
    function sendEmail(to, subject, username, password) {
        glTo = to;
        glUsername = username;
        glPassword = password;
        glSubject = subject;
        ReadTemplate.read.getOneRecord({ name: "userPasswordEmailTemplate" }, processEmail);
    }

    function processEmail(result) {
        if (result != undefined) {
            var obj = result;
            var content = obj.content;

            var username = '$username$';
            var newstr = content.replace(username, glUsername);

            var password = '$password$';
            var newcontent = newstr.replace(password, glPassword);

            var obj = {};
            obj.to = glTo;
            obj.cc = "";
            obj.bcc = "";
            obj.subject = glSubject;
            obj.body = newcontent;

            //console.log("---obj---");
            //console.log(obj);

            var geEmail = new GeEmailModel(obj);
            geEmail.save();
        }
    }

    function processMessage(err) {
        {
            if (!err) {
                response.message = "Saved Sucessfully";
                response.statusHttp = 200;
                response.statusBool = true;
                //setting response.data because of to received created user encrypted password.
                response.data = { "password": cpassword };
            }
            else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while save data";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }
};

exports.createLogHistory = function (payLoad, resultData) {
    var response = {};
    var logHistory = new logHistoryModel(payLoad);
    logHistory.save(processMessage);

    function processMessage(err) {
        {
            if (!err) {
                response.message = "Saved Sucessfully";
                response.statusHttp = 200;
                response.statusBool = true;
            }
            else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while save login history data";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }
};