
'use strict';
var emailer = require('../../../config/nodemailer').emailer;
var emailModel = require('../../../model/general/email.model').model;
var EmailSentModel = require('../../../model/general/email.sent.model').model;
var logger = require('winston');

exports.sendMail = function(resultData) {
    var gEmailDoc = [];

    //get emails from the DB
    emailModel.find()
        .exec(emailReadResult);

    function emailReadResult(err, emailDoc) {
        if (err) {
            resultData(false)
            return;
        }

        if (emailDoc === undefined || emailDoc === null || emailDoc.length === 0) {
            resultData(false)
            return;
        }
        gEmailDoc = emailDoc;
        parseAndSendemail(0);
    }

    function convertEmail(emailID) {

        //if environment is not production the send email to temp mailbox - mailinator
        if (process.env.NODE_ENV !== 'production') {
            return (emailID.substring(0, emailID.indexOf("@") + 1)) + 'mailinator.com';
        } else {
            return emailID;
        }
    }


    function parseAndSendemail(i) {
        gEmailDoc[i].to = convertEmail('' + gEmailDoc[i].to);
        gEmailDoc[i].cc = convertEmail('' + gEmailDoc[i].cc);
        gEmailDoc[i].bcc = convertEmail('' + gEmailDoc[i].bcc);

        var mailOptions = {
            from: 'ideal<noreply@ideal.com>', // sender address
            to: gEmailDoc[i].to,
            cc: gEmailDoc[i].cc,
            bcc: gEmailDoc[i].bcc,
            subject: gEmailDoc[i].subject,
            html: gEmailDoc[i].body
        };

        var j = 0;
        sendEmail();

        function sendEmail() {
            emailer[j].sendMail(mailOptions, emailSendResponse)
        }

        function emailSendResponse(error, info) {
            if (error) {
                console.log("*******ERROR**********");
                console.log(error);
                console.log(mailOptions.to);
                if ((emailer.length - 1) === j) {
                    logger.info('Cannot send email through all configured emails');
                    i = i + 1;
                    if (i >= gEmailDoc.length) {
                        console.log("******* :" + i);
                        resultData(false);
                        return;
                    }
                    parseAndSendemail(i);
                    return;
                }
                logger.info('Changing sender email');
                j = j + 1;
                sendEmail();
                return;
            }

            //Move email to another collection
            var emailSentDoc = new EmailSentModel({
                to: gEmailDoc[i].to,
                cc: gEmailDoc[i].cc,
                bcc: gEmailDoc[i].bcc,
                subject: gEmailDoc[i].subject,
                body: gEmailDoc[i].body,
                sentByIndex: j
            });

            emailSentDoc.save(saveEmailSendResult);
        }

        function saveEmailSendResult(err) {
            if (!err)
                emailModel.remove({ _id: gEmailDoc[i]._id }, removeEmailResult)
        }

        function removeEmailResult(err) {
            if (!err) {
                if ((gEmailDoc.length - 1) === i) {
                    resultData(true)
                    return;
                }
                i = i + 1;
                parseAndSendemail(i);
            }
        }
    }
};
