
'use strict';
var mongoose = require('../../config/mongo').mongoose;
var Schema = mongoose.Schema;

var templateSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },
   
    isActive: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String
        //required: true
    },
    updatedDate: Date,
    updatedBy: String
});

var template = mongoose.model('geTemplate', templateSchema, 'geTemplate');

exports.model = template;

