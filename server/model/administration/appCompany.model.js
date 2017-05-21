
'use strict';
var mongoose = require('../../config/mongo').mongoose;
var Schema = mongoose.Schema;

var companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    rocNo: String,
    cpfNo: String,
    csnNo: String,
    address: String,
    phoneNumber: [{
        countryCode: String,
        areaCode: String,
        pNumber: String
    }],
    faxNumber: String,
    email: String,
    webSite: String,
    department: [{
        name: {
            type: String,
            required: true
        },
        abbr: {
            type: String,
            required: true
        },
        deptHead: {
            type: String,
            required: true
        },
        remarks: String,
        incharge: [{
            ref: { type: Schema.Types.ObjectId, ref: 'umUser' },
            name: String
        }],
        seed: {
            commercial: { abbr: String, nextValue: Number, minValLen: Number },
            overHead: { abbr: String, nextValue: Number, minValLen: Number }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    remarks: {
        type: String
    },
    tax: {
        isFixed: Boolean,
        taxes: [{
            name: String,
            variation: [{
                percent: Number,
                effectiveDate: Date,
                isActive: {
                    type: Boolean,
                    default: true
                }
            }]
        }]
    },
    seed: {
        asset: [{
            ref: { type: Schema.Types.ObjectId, ref: 'smAssetCategory' },
            abbr: String,
            nextValue: Number,
            seperator: String,
            minValLen: Number,
            effectiveDate: {
                type: Date,
                default: Date.now
            },
            isActive: {
                type: Boolean,
                default: true
            },
            assetAccessories: {
                nextValue: Number,
                minValLen: Number
            }
        }],
        purchaseRequest: {
            abbr: String,
            nextValue: Number,
            seperator: String,
            minValLen: Number,
            effectiveDate: {
                type: Date,
                default: Date.now
            },
            isActive: {
                type: Boolean,
                default: true
            }
        },
        purchaseOrder: {
            abbr: String,
            nextValue: Number,
            seperator: String,
            minValLen: Number,
            effectiveDate: {
                type: Date,
                default: Date.now
            },
            isActive: {
                type: Boolean,
                default: true
            }
        }
    },
    payCycle: [{
        name: String,
        dateRange: {
            fromDate: String,
            toDate: String
        }
    }],
    template: {
        logo: String,
        letterHead: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: String,
    updatedDate: Date
});

var company = mongoose.model('amCompany', companySchema, 'amCompany');

exports.model = company;
