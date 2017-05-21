'use strict';

var adminSettingsModel = require('../../../model/administration/setting.model').model;
var readSettings = require('./');


exports.updateRecord = function (payLoad, resultData) {
    try { 
        var response = {};
        var isValid = true;
        
        processRecord();

        function processRecord() {
            if (isValid) {
                adminSettingsModel.update({ _id: payLoad._id }, { $set: payLoad }, processMessage);
            }
            else {
                processMessage(true);
            }
        }

        function processMessage(err) {
            if (!err) {
                response.statusHttp = 200;
                response.statusBool = true;
                response.message = "Updated Sucessfully";
            }
            else {
                if (response.statusHttp === undefined || response.statusHttp.length == 0)
                    response.statusHttp = 500;
                response.statusBool = false;
                if (response.message === undefined || response.message.length == 0) {
                    response.message = "Error while update data";
                    response.rawError = err;
                }
            }
            console.log(response);
            resultData(response);
        }

    }
    catch (err) {
        console.error(err);
    }
};