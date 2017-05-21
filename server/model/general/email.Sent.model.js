
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
    },
    sentDate: {
        type: Date,
        default: new Date()
    },
    sentByIndex: Number
});

var email = mongoose.model('geEmailSent', emailSchema, 'geEmailSent');

exports.model = email;

