
'use strict';
var mongoose = require('../../config/mongo').mongoose;
var Schema = mongoose.Schema;

var emailSchema = new Schema({
    to: {
        type: String,
        required: true
    },
    cc: {
        type: String
    },
    bcc: {
        type: String
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

var email = mongoose.model('geEmail', emailSchema, 'geEmail');

exports.model = email;

