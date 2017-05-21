'use strict';
var PermissionModel = require('../../../model/userManagement/permission/permission.model').model;
// var RoleModel = require('../../../model/userManagement/role.model').model;
// var ReadRole = require('../role/');
var ReadPermission = require('./');

exports.updateRecord = function (payLoad, resultData) {
    try {
        var response = {};
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
        else {

            processRecord();
        }
    }
    catch (err) {
        console.error(err);
    }

    function processRecord() {
        if (payLoad.isActive == false) {
            PermissionModel.update({ _id: payLoad._id }, { $set: { 'isActive': false, 'updatedBy': payLoad.updatedBy, 'updatedDate': new Date() } }).then(function (res1) {
                ReadPermission.defaultCreate.defautCreateRecord().then(function (res1) {
                    if (res1.statusBool) {
                        processMessageForDelete(false);
                    } else {
                        processMessageForDelete(true);
                    }
                });
            });
        }
        else {
            payLoad.updatedDate = new Date();
            PermissionModel.update({ _id: payLoad._id }, { $set: payLoad }, processMessage);
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



exports.updateRoleRecord = function (payLoad, resultData) {
    var roleId = payLoad.role;
    var pemissionId = payLoad.permissionId;
    var response = {};

    try {
        processRecord(roleId, pemissionId);
      
    }
    catch (err) {
        console.error(err);
    }

    function processRecord(roleId,permissionId) {
        RoleModel.update({ _id: { $in: roleId }, "permission._id": permissionId, "isActive": true }, { $set: { "permission.$.isActive": false } }, { multi: true }, processMessage);
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
