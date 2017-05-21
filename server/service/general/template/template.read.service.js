'use strict';
var TemplateModel = require('../../../model/general/template.model').model;

exports.getOneRecord = function (option, resultData) {
    resultData.isActive = true;
    TemplateModel
        .findOne(option)
        .exec(processResult);
    
    function processResult(err, templateSchema) {
        resultData(templateSchema);
    }
};





