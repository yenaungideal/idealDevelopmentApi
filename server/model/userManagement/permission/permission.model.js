
'use strict';
var mongoose = require('../../../config/mongo').mongoose;
var Schema = mongoose.Schema;

var permissionSchema = new Schema({
    module: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    
    description: String,

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

var permission = mongoose.model('umPermission', permissionSchema, 'umPermission');

exports.model = permission;

