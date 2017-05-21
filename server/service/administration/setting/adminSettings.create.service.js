'use strict';

var settingModel = require('../../../model/administration/setting.model').model;
var readSettings = require('./');

exports.createRecord = function (payLoad, resultData) {
    var setting = new settingModel(payLoad);
    setting.validate(schemaValidationComplete);

    function schemaValidationComplete(err) {
        if (!err) {
            //Check unique setting
            var appKey= { key: payLoad.key };
            readSettings.read.getOneRecord(appKey, uniqueValidationComplete);
        }
        else {
            console.log(err);
            returnResponse(419, false, "Error while save data", err);
        }
    }

    function uniqueValidationComplete(result) {
        console.log(result);
        if (result !== null) {
                returnResponse(409, false, "Key already exists");
        }
        else {
            if (payLoad.key === undefined || payLoad.key === null || payLoad.key.length === 0) {
                returnResponse(419, false, "Key is required");
            }
            else if (payLoad.value === undefined || payLoad.value === null || payLoad.value.length === 0) {
                returnResponse(419, false, "value is required");
            }
            else {
                setting.save(processMessage);
            }
        }
    }

    function processMessage(err) {
        if (!err) {
            returnResponse(200, true, "Saved Sucessfully", payLoad);
        }
        else {
            returnResponse(419, false, "Error while save data", err);
        }
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