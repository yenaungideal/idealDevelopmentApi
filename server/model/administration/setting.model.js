'use strict';
var mongoConfig = require('../../config/mongo');
var mongoose = mongoConfig.mongoose;
var commonField = mongoConfig.commonField;

var Schema = mongoose.Schema;

var settingSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    unit: String,
    remarks: String,
    isShowToUser: {
        type: Boolean,
        default: true
    },
    applicableAt: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedBy: String,

    updatedDate: Date
});

var setting = mongoose.model('amSetting', settingSchema, 'amSetting');

exports.model = setting;

