'use strict';
var RoleModel = require('../../../model/userManagement/role/role.model').model;
var ReadRole = require('./');

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
        else if (payLoad.createdBy === "" || payLoad.createdBy === undefined || payLoad.createdBy.length === 0) {
            //Check User having createdBy
            response.message = "CreatedBy is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
        }
        else {
                //Check for unique Role
                var option = { name: payLoad.name,isActive : true };
                ReadRole.read.getDuplicateRecord(option, processUniqueValidation);
        }
    }
    catch (err) {
        console.error(err);
    }

    function processUniqueValidation(result) {
        if (result !== null) {
            response.message = "Role Name already exists";
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
            var role = new RoleModel(payLoad);
            role.save(processMessage);
        }
        else {
            processMessage(true);
        }
    }

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
                    response.message = "Error while save data";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }
};