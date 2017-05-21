'use strict';
var schedule = require('node-schedule');
var emailSender = require('../service/general/email').send;
var logger = require('winston');

var isEmailScheduleRunning = false;
var j = schedule.scheduleJob('*/5 * * * * *', function () {
 
    if (isEmailScheduleRunning)
        return;
    isEmailScheduleRunning = true;

    emailSender.sendMail(function (res) {
        isEmailScheduleRunning = false;
    });

});


