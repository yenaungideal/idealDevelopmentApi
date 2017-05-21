'use strict';
var TemplateModel = require('../../../model/general/template.model').model;

exports.createRecord = function (payLoad, resultData) {
    var response = {};

    var template = new TemplateModel(payLoad);
    template.save(processMessage);

    function processMessage(err) {
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
                    response.message = "Error while save data";
                    response.rawError = err;
                }
            }
            resultData(response);
    }

};



