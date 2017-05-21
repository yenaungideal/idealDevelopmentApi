
'use strict';
var mongoose = require('../../../config/mongo').mongoose;
var Schema = mongoose.Schema;

var loginHistorySchema = new Schema({

    name:String,
    attemptTime: Date,
    attemptStatus: String,
    attemptResult:Boolean,
    attemptDescription:String,
    attemptCount:Number
});

var loginHistory = mongoose.model('umLoginHistory', loginHistorySchema, 'umLoginHistory');
exports.model = loginHistory;
