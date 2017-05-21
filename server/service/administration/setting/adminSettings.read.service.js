'use strict';

var adminSettingsModel = require('../../../model/administration/setting.model').model;

exports.getRecord = function (resultData) {
    adminSettingsModel
        .find({ isActive: true })
        .exec(processResult);

    function processResult(err, setting) {
        resultData(setting);
    }
}; 

exports.getOneRecord = function (option, resultData) {
    option.isActive = true;
    adminSettingsModel
        .findOne(option)
        .exec(processResult);

    function processResult(err, setting) {
        resultData(setting);
    }
};

exports.getOneRecordByOptionName = function (option) {
    option.isActive = true;
   return adminSettingsModel
        .findOne(option)
        .exec();
};

exports.getValueByKey = function (option, resultData) {
    option.isActive = true;
    adminSettingsModel
            .findOne(option)
            .exec(processResult);
    
    function processResult(err, setting) {
        resultData(setting);
    }
};