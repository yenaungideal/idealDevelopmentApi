'use strict';

var Common = require('../../../service/general/common');

exports.getEncryptionPassword = function (req, res) {
    var option = {};
    if (req.body.password !== undefined) {
        option.password = req.body.password;
    }
    Common.read.getEncryptionPassword(option, function (result) {
        res.json(result);
    });
}; 

exports.comparePassword = function (req, res) {
    console.log("-----common controller compare password-----");

    Common.read.comparePassword(req.body, function (result) {
        console.log("-------common controller compare password result--------");
        console.log(result);
        res.json(result);
    });
};




