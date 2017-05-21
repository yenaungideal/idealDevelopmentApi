'use strict';
var permission = require('../../../service/userManagement/permission');

exports.index = function (req, res) {         
    permission.read.getRecord(function (result) {
        res.json(result);
    });
};

exports.indexbyId = function (req, res) {
    var option = {};
    if (req.params._id !== undefined) {
        option._id = req.params._id;
    }
    
    permission.read.getOneRecord(option, function (result) {
        res.json(result);
    });
};

exports.create = function (req, res) {
    permission.create.createRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

exports.update = function (req, res) {
    permission.update.updateRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};
