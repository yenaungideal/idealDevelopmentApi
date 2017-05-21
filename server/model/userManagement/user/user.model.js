
'use strict';
var mongoose = require('../../../config/mongo').mongoose;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var userSchema = new Schema({
    
    name: {
        type: String,
        required: true
    },    
    password: {
        type: String,
        required: true
    },
    oldPassword: [{
            password: String
        }],
    forcePasswordChange: {
        type: Boolean,
        required: true,
        default: true
    },    
    role: [{
            ref: { type: Schema.Types.ObjectId, ref: 'umRole' },
            name: String,
            isActive: {
                type: Boolean,
                default: true
            }
        }],
    company: [{
        ref: { type: Schema.Types.ObjectId, ref: 'amCompany' },
        isActive: {
            type: Boolean,
            default: true
        },
        department: [
            {
                ref: Schema.Types.ObjectId,
                isActive: {
                    type: Boolean,
                    default: true
                }
            }
        ]
    }],
    emp: [{
            ref: { type: Schema.Types.ObjectId, ref: 'hrEmployee' },
            number: String,
            isActive: {
                type: Boolean,
                default: true
            }
    }],
    email: {
        type: String,
        required: true
    },
    remarks: String,
    attachment: {
        ref: Schema.Types.ObjectId,
        fileName: String
    },
    invalidAttemptCount: {
        type: Number, 
        default: 0
    },
    isLocked: {
        type: Boolean,
        required: true,
        default: false
    },   
    lastLogin: Date,
    lastLocked: Date,
    lastPasswordChanged: Date,
    source: String,
    permissions:String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedDate: Date,
    updatedBy: String
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var user = mongoose.model('umUser', userSchema, 'umUser');

exports.model = user;

