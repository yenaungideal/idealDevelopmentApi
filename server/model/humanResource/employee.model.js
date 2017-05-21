
'use strict';
var mongoose = require('../../config/mongo').mongoose;
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    empId: { type: String, required: true },
    firstEmpId: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    supervisor: {
        no: { type: String },
        name: { type: String },
        ref: { type: Schema.Types.ObjectId, ref: 'hrEmployee' }
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'amCompany'
    },
    groupName: {
        type:String
    },
    department: Schema.Types.ObjectId,
    project: {
        type: Schema.Types.ObjectId,
        ref: 'prProject'
    },
    site: String,
    shift: {
        type: Schema.Types.ObjectId,
        ref: 'tmShift'
    }, 
    empType: { type: String, required: true },
    designation:String,
    dob: Date,
    doj: Date,
    fdoj: Date,
    gender: String,
    emailId: String,
    lastWorkingDay: Date,
    status: String,
    maritalStatus: String,
    nationality: String,
    designation: String,
    supplierCompany : Schema.Types.ObjectId,
    isTimeExempted: {
        type: Boolean,
        default: false
    },
    kids: [{
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            dob: {
                type: Date,
                required: true
            },
            nationality: {
                type: String,
                required: true
            },
            isKidstayInCompanycountry: {
                type: Boolean,
                required: true
            },
            gender: {
                type: String
            },
            isActive: {
                type: Boolean,
                required: true
            }
        }],
    entitlementAL: [{
            id: {
                type: Number,
                required: true
            },
            entitlement: {
                type: Number,
                required: true
            },
            effectiveDate: {
                type: Date,
                required: true
            },
            isActive: {
                type: Boolean,
                required: true
            }
        }],
    isActive: {
        type: Boolean,
        default: true
    },
    eId: Number,
    AVLdaysOnmigration : Number,
    carryforward : Number,
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }
});

var employee = mongoose.model('hrEmployee', employeeSchema, 'hrEmployee');

exports.model = employee;
