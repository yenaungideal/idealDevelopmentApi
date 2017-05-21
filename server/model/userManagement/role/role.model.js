
'use strict';
var mongoose = require('../../../config/mongo').mongoose;
var Schema = mongoose.Schema;

var roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: String,

    permission: [{
        ref: { type: Schema.Types.ObjectId, ref: 'umPermission' },
        module: String,
        name:String,
        read: Boolean,
        write: Boolean
    }],

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

var role = mongoose.model('umRole', roleSchema, 'umRole');

exports.model = role;

