'use strict';
var express = require('express');
var router = express.Router();
var controller = require('./auth.controller');

router.post('/', controller.aunthenticate);
router.post('/createLogoutHistory', controller.createLogoutHistory);
router.post('/getLogHistory', controller.getLogHistory);

module.exports = router;
