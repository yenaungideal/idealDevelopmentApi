'use strict';
var permissionModel = require('../../../model/userManagement/permission/permission.model').model;
var readPermission = require('./');

exports.createRecord = function (payLoad, resultData) {
    
    try {
        var response = {};
        var isValid = true;
        //Validations
        if (payLoad.module === "" || payLoad.module === undefined || payLoad.module.length === 0) {
            //Check Module having name
            response.message = "Module is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
        }
        else if (payLoad.name === "" || payLoad.name === undefined || payLoad.name.length === 0) {
            //Check Name having name
            response.message = "Name is required";
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
           //Check for unique data
            var option = { module: payLoad.module, name: payLoad.name, isActive: true };
            readPermission.read.getDuplicateRecord(option, processUniqueValidation);
 
        }
    }
    catch (err) {
        console.error(err);
    }

    function processUniqueValidation(result) {
        if (result !== null) {
            response.message = "Permission Name already exists in Module";
            response.statusHttp = 409;
            response.statusBool = false;
            isValid = false;
        }
        else {
            isValid = true;
        }
        processRecord();
    }

    function processRecord() {
        if (isValid) {
            var permission = new permissionModel(payLoad);
            permission.save(processMessage);
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
                response.message = "Saved Sucessfully";
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