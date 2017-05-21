'use strict';
var express = require('express');
var router = express.Router();
var controller = require('./template.controller');

router.post('/create', controller.create);// createEmailTemplate

module.exports = router;