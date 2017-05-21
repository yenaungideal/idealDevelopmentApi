'use strict';
var UserModel = require('../../../model/userManagement/user/user.model').model;
var EmployeeModel = require('../../../model/humanResource/employee.model').model;
var RoleModel = require('../../../model/userManagement/role/role.model').model;
var CompanyModel = require('../../../model/administration/appCompany.model').model;

exports.getRecord = function (resultData) {
    UserModel
        .find({ isActive: true }).sort({ createdDate: -1 })
        .exec(processResult);
    
    function processResult(err, userSchema) {
        resultData(userSchema);
    }
};

exports.getEmployee = function (option, resultData) {
    EmployeeModel
        .find({ "_id": { "$nin": option }, isActive: true })
        .sort({ createdDate: -1 })
        .exec(processResult);

    function processResult(err, employeeSchema) {
        resultData(employeeSchema);
    }
};

exports.getRole = function (resultData) {
    RoleModel
        .find({ isActive: true }).sort({ createdDate: -1 })
        .exec(processResult);

    function processResult(err, roleSchema) {
        resultData(roleSchema);
    }
};

exports.getCompanies = function (resultData) {
    CompanyModel
        .find({ isActive: true }).sort({ createdDate: -1 })
        .exec(processResult);

    function processResult(err, companySchema) {
        resultData(companySchema);
    }
};

exports.getDuplicateRecord = function (option, resultData) {
    UserModel.findOne({ name: new RegExp('^' + option.name + '$', "i"), isActive: true }).exec(processResult);

    function processResult(err, userSchema) {
        resultData(userSchema);
    }
};

exports.getDuplicateRecordByEmailInEdit = function (option, resultData) {
    UserModel.findOne({ _id: { "$nin": option.id }, isActive: true, email: option.email }).exec(processResult);

    function processResult(err, userSchema) {
        resultData(userSchema);
    }
};

exports.getOneRecord = function (option, resultData) {
    UserModel
        .findOne(option)
        .exec(processResult);

    function processResult(err, userSchema) {
        resultData(userSchema);
    }
};

