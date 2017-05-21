'use strict';
var UserModel = require('../../../model/userManagement/user/user.model').model;
var GeEmailModel = require('../../../model/general/email.model').model;
var Common = require('../../general/common/');
var ReadTemplate = require('../../general/template');
var ReadUser = require('./');
var ReadRole = require('../../userManagement/role');
var ReadPermission = require('../../userManagement/permission');
var _ = require('lodash');

exports.updateRoleRecord = function (payLoad, resultData) {
    return new Promise(function (resolve, reject) {
        var response = {};
        var isValid = true;
        var userPermissions = [];
        var roleData;
        var permissions;
        var userRoles = [];
        var permissionData;
        var i = 0;
        var j = 0;
        var objectVal = {};
        var finalValues = [];

        payLoad.role.forEach(function(row,index){
            if(row.isActive)
            {
                userRoles.push(row);
            }
        });

        /*userRoles = payLoad.role;*/
        userRolesRecur();

        function userRolesRecur() {
            j = 0;
            var row = userRoles[i];

            if (row === undefined) {
                reCreate();

                function reCreate() {
                    userPermissions.forEach(function (row, index) {
                        finalValues = arrayUnion(finalValues, userPermissions[index]);
                    });
                    var finalData;
                    if (finalValues.length > 0) {
                        var object = {};
                        object = toObject(finalValues);
                        finalData = _.transform(object, function (result, item, name) {
                            name = item.name;
                            delete item.name;
                            result[item.module] = result[item.module] || {};
                            result[item.module][name] = result[item.module][name] || {};
                            result[item.module][name] = item;
                            delete result[item.module][name].module;
                        });
                        console.log("******************************User****************************");
                        console.log("*******************Name********************** :  " + payLoad.name);
                        console.log("************************Roles**************** :  " + userRoles);
                    }
                    else {
                        //get defalut Permissions
                        var param = {
                            key: "Permissions",
                            isShowToUser: false
                        };
                        svrSetting.read.getOneRecordByOptionName(param).then(function (res1) {
                            if (res1 !== undefined && res1 !== null) {
                                finalData = JSON.parse(res1.value);
                            }
                        });
                    }
                    //console.log("************************Final Permission*************************");
                    //console.log(finalData);
                    returnResponse(200, true, "Updated Sucessfully", finalData);
                }
            }
            userPermissions[i] = [];
        
            var roleParam = {
                _id: row.ref,
                isActive: true
            };
            roleData = row;
            ReadRole.read.getOneRecordByID(roleParam).then(getPermissionDetails);
        }

        function getPermissionDetails(res2) {
            if (res2 !== undefined && res2 !== null)
            {
                permissions = res2.permission;
                permissionsRecur();
            } else {
                i += 1;
                userRolesRecur();
            }
        }

        function permissionsRecur() {
            objectVal = {};
            var row = permissions[j];

            if (row === undefined || row === null) {
                i += 1;
                userRolesRecur();
            }
            var perParam = {
                _id: row._id
            }

            permissionData = row;
            if (permissionData.read === undefined || permissionData.read === null) {
                permissionData.read = false;
            }
            objectVal.read = permissionData.read;
            if (permissionData.write === undefined || permissionData.write === null) {
                permissionData.write = false;
            }
            objectVal.write = permissionData.write;
            objectVal.module = permissionData.module;
            objectVal.name = permissionData.name;

            userPermissions[i].push(objectVal);

            j += 1;
            permissionsRecur();
        }

        function arrayUnion(arr1, arr2) {
            var union = arr2.concat(arr1);
            for (var i = 0; i < union.length; i++) {
                for (var j = i + 1; j < union.length; j++) {

                    if (union[i].module == union[j].module && union[i].name == union[j].name) {

                        if (_.isEqual(union[i], union[j])) {
                            union.splice(j, 1);
                            j--;
                        } else {
                            if (union[i].read === true && union[j].read === true) {
                                union[i].read = true;
                            } else if (union[i].read === true && union[j].read === false) {
                                union[i].read = true;
                            } else if (union[i].read === false && union[j].read === true) {
                                union[i].read = true;
                            } else {
                                union[i].read = false;
                            }

                            if (union[i].write === true && union[j].write === true) {
                                union[i].write = true;
                            } else if (union[i].write === true && union[j].write === false) {
                                union[i].write = true;
                            } else if (union[i].write === false && union[j].write === true) {
                                union[i].write = true;
                            } else {
                                union[i].write = false;
                            }
                            union.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
            return union;
        }

        function toObject(arr) {
            var rv = {};
            for (var i = 0; i < arr.length; ++i) {
                rv[i] = arr[i];
            }
            return rv;
        }

        function returnResponse(statusHttp, statusBool, message, data) {
            resolve({
                statusHttp: statusHttp,
                statusBool: statusBool,
                message: message,
                data: data
            });
        }
    });
};