'use strict';

var Template = require('../../../service/general/template');

exports.create = function (req, res) {
    Template.create.createRecord(req.body, processResult);

    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};
