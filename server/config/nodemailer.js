var config = require('../config/environment');
var nodemailer = require('nodemailer');

var credentials = [
    { auth: { user: 'notifier5@cutech-outsourcing.com', pass: 'cutech2050' }, host: 'smtpout.asia.secureserver.net', port: 3535, secure: false }
];

var credentials = [
    { auth: { user: 'notifier1@cutech-outsourcing.com', pass: 'cutech2050' }, host: 'smtpout.asia.secureserver.net', port: 3535, secure: false },
    { auth: { user: 'notifier2@cutech-outsourcing.com', pass: 'cutech2050' }, host: 'smtpout.asia.secureserver.net', port: 3535, secure: false },
    { auth: { user: 'notifier3@cutech-outsourcing.com', pass: 'cutech2050' }, host: 'smtpout.asia.secureserver.net', port: 3535, secure: false },
    { auth: { user: 'notifier4@cutech-outsourcing.com', pass: 'cutech2050' }, host: 'smtpout.asia.secureserver.net', port: 3535, secure: false },
    { auth: { user: 'notifier5@cutech-outsourcing.com', pass: 'cutech2050' }, host: 'smtpout.asia.secureserver.net', port: 3535, secure: false }
];

var transporter = [];
for (var i = 0; i < credentials.length; i++) {
    //var tans = nodemailer.createTransport('smtp://' + credentials[i].email + ':' + credentials[i].password + '@' + credentials[i].server);
    var tans = nodemailer.createTransport(credentials[i]);
    transporter.push(tans);
}


exports.emailer = transporter;
