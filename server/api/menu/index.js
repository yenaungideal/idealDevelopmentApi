'use strict';
var express = require('express');
var router = express.Router();

var controller = require('./menu.controller');
router.post('/', controller.index);
module.exports = router;
