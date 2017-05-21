'use strict';
var RoleModel = require('../../../model/userManagement/role/role.model').model;
var UserModel = require('../../../model/userManagement/user/user.model').model;
var ReadRole = require('../role/');
exports.updateRecord = function (payLoad, resultData) {

    try {
        var response = {};
        var isValid = true;

        if (payLoad.name === "" || payLoad.name === undefined || payLoad.name.length === 0) {
            //Check User having name
            response.message = "Name is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
            isValid = false;
        } else {
            processRecord();
        }
    }
    catch (err) {
        console.error(err);
    }

    function processRecord() {
        if (isValid) {
            if (payLoad.isActive == false) {
                RoleModel.update({ _id: payLoad._id }, { $set: { 'isActive': false, 'updatedBy': payLoad.updatedBy, 'updatedDate': new Date() } }, processMessageForDelete);
            }
            else {
                payLoad.updatedDate = new Date();
                RoleModel.update({ _id: payLoad._id }, { $set: payLoad }, processMessage);
            }

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
                response.message = "Updated Sucessfully";
            }
            else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while update data";
                    response.rawError = err;
                }
            }

            resultData(response);
        }
    }

    function processMessageForDelete(err) {
        {
            if (!err) {
                response.statusHttp = 200;
                response.statusBool = true;
                response.message = "Deleted Sucessfully";
            }
            else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while delete data";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }
};

exports.updateUserRoleRecord = function (payLoad, resultData) {
    var userId = payLoad.user;
    var roleId = payLoad.roleId;
    var response = {};

    try {
        processRecord(userId, roleId);
    }
    catch (err) {
        console.error(err);
    }

    function processRecord(userId, roleId) {
        UserModel.update({ _id: { $in: userId }, "role._id": roleId, "isActive": true }, { $set: { "role.$.isActive": false } }, { multi: true }, processMessage);
    }

    function processMessage(err) {
        {
            if (!err) {
                response.statusHttp = 200;
                response.statusBool = true;
                response.message = "Updated Sucessfully";
            }
            else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while update data";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }
};