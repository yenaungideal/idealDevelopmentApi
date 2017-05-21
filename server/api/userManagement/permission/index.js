'use strict';
var express = require('express');
var router = express.Router();

var controller = require('./permission.controller');

router.get('/', controller.index);//select data for view
router.get('/:_id', controller.indexbyId);// select data to edit
router.post('/create', controller.create);// create data
router.post('/update', controller.update);// update & delete data
module.exports = router;