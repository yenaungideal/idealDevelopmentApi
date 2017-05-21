'use strict';
var express = require('express');
var router = express.Router();
var controller = require('./common.controller');

router.post('/getEncryptionPassword', controller.getEncryptionPassword);// select data to edit

router.post('/comparePassword', controller.comparePassword);// select data to edit

module.exports = router;