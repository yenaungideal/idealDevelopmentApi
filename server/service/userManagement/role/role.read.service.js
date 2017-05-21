'use strict';
var RoleModel = require('../../../model/userManagement/role/role.model').model;
var PermissionModel = require('../../../model/userManagement/permission/permission.model').model;
var ReadRole = require('./');

exports.getRecord = function(resultData) {
    RoleModel
        .find({ isActive: true }).sort({ createdDate: -1 })
        .exec(processResult);

    function processResult(err, roleSchema) {
        resultData(roleSchema);
    }

};

exports.getOneRecord = function(option, resultData) {
    RoleModel
        .findOne(option)
        .exec(processResult);

    function processResult(err, roleSchema) {
        resultData(roleSchema);
    }

};


 exports.getOperations = function(resultData) {
     PermissionModel
         .find({ isActive: true }).sort({ module: -1 })
         .exec(processResult);

     function processResult(err, operationSchema) {
         resultData(operationSchema);
     }
 };

// exports.getAllRoleByPermissionId = function(option) {
//     return RoleModel
//         .find(option)
//         .exec();
// };


// exports.getAllRoleByPermission = function (option) {
//     return RoleModel
//         .aggregate([
//         { $unwind: "$permission" },
//         {
//             $match: { "permission.ref" : { $in: option.permissionId } , "permission.write": true,"permission.isActive": true, "isActive" : true }
//         }])
//         .exec();
// };


 exports.getOneRecordByID = function(option, resultData) {
     return RoleModel
         .findOne(option)
         .exec();
 };

// exports.getOperationsByRoleID = function(option, resultData) {
//     var i = 0;
//     var obj = [];
//     OprationByRoleID(option);

//     function OprationByRoleID(option) {
//         if (i == option.length) {
//             resultData(obj);
//         }

//         var roleID = option[i]._id;
//         var param = {};
//         param._id = roleID;

//         var promise = readRole.read.getOneRecordByID(param);

//         promise.then(processResult);

//     }

//     function processResult(roleSchema) {
//         var obj2 = {};
//         obj2._id = roleSchema._id;
//         obj2.operation = roleSchema.operation;

//         obj.push(obj2);
//         i++;
//         OprationByRoleID(option);
//     }
// };

exports.getDuplicateRecord = function(option, resultData) {
    RoleModel.findOne({ name: new RegExp('^' + option.name + '$', "i"), isActive: true }).exec(processResult);

    function processResult(err, roleSchema) {
        resultData(roleSchema);
    }
};


// exports.getPermissionByRoles = function (option, resultData) {
//     var role = option.role;
//     RoleModel.find({ _id: { $in: role }, isActive: true }).exec(processResult);
//     function processResult(err, roleSchema) {
//         resultData(roleSchema);
//     }
// };
