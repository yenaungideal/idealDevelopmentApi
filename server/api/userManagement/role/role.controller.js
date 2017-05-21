'use strict';
var role = require('../../../service/userManagement/role');

exports.index = function (req, res) {
    role.read.getRecord(function (result) {
        console.log(result);
        res.json(result);
    });
};

exports.indexbyId = function (req, res) {
    var option = {};
    if (req.params._id !== undefined) {
        option._id = req.params._id;
    }

    role.read.getOneRecord(option, function (result) {
        res.json(result);
    });
};

exports.create = function (req, res) {
    role.create.createRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

exports.update = function (req, res) {
    role.update.updateRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

 exports.getOperations = function (req, res) {
     role.read.getOperations(function (result) {
         res.json(result);
     });
 };


// exports.deleteUserRole = function (req, res) {
//     role.update.updateUserRoleRecord(req.body, processResult);
//     function processResult(result) {
//         res.status(result.statusHttp);
//         res.json(result);
//     }
// };

// exports.getPermissionByRoles = function (req, res) {
    
//     role.read.getPermissionByRoles(req.body, processResult);
//     function processResult(result) {
//         res.json(result);
//     }
// };