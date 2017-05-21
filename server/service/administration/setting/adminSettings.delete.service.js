'use strict';

var settingModel = require('../../../model/administration/setting.model').model;
var readSettings = require('./');

exports.deleteRecord = function (payLoad, resultData) {
    console.log(payLoad);
        try {
            var response = {};
            var isValid = true;
            processRecord();
            function processRecord() {
                if (isValid) {
                    console.log("payLoad" + payLoad);
                    settingModel.update({ '_id': payLoad._id }, { $set: { 'isActive': false, 'updatedBy': payLoad.updatedBy, 'updatedDate': payLoad.updatedDate } }, processMessage);
                }
                else {
                    processMessage(true);
                }
            }

            function processMessage(err) {
                {
                    if (!err) {
                        response.statusHttp = 200;
                        response.statusBool = true;
                        response.message = "Deleted Sucessfully";
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
                    console.log("from delete service server " +response);
                    resultData(response);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    };

   





