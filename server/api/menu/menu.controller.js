'use strict';

var svrMenu = require('../../service/menu');

exports.index = function (req, res) {
    var option = {};
    if (req.body !== undefined) {
        option = req.body;
    }
    console.log("************************Menu Loading Option*************************");
    console.log(option)
    svrMenu.read.loadMenu(option, function (result) {
        res.json(result);
    });
};

