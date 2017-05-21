
'use strict';
var EmailModel = require('../../../model/general/email.model').model;

exports.sendMail = function(payLoad, resultData) {

    var strHtml = payLoad.body1;
    strHtml = strHtml.replace(/\n$/, '');
    payLoad.body = strHtml;

    var email = new EmailModel(payLoad);
    email.save();

    processRecord();

    function processRecord() {
        returnResponse(200, true, "email was successfully sent.");
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
