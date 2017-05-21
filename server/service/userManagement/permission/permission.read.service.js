'use strict';
var permissionModel = require('../../../model/userManagement/permission/permission.model').model;

exports.getRecord = function(resultData) {
    permissionModel
        .find({ isActive: true }).sort({ module: 1, name: 1 })
        .exec(processResult);

    function processResult(err, permissionSchema) {
        resultData(permissionSchema);
    }

};

exports.getOneRecord = function(option, resultData) {
    permissionModel
        .findOne(option)
        .exec(processResult);

    function processResult(err, permissionSchema) {
        resultData(permissionSchema);
    }
};

exports.getDuplicateRecord = function(option, resultData) {
    permissionModel.findOne({ module: new RegExp('^' + option.module + '$', "i"), name: new RegExp('^' + option.name + '$', "i"), isActive: true }).exec(processResult);

    function processResult(err, permissionSchema) {
        resultData(permissionSchema);
    }
};