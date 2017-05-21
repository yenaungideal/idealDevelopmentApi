'use strict';
var express = require('express');
var router = express.Router();

var controller = require('./role.controller');

router.get('/', controller.index);//select data for view
router.get('/:_id', controller.indexbyId);// select data to edit
router.post('/create', controller.create);// create data
router.post('/update', controller.update);
 router.get('/getOperations/getOperationsData', controller.getOperations);//select operations data 
// router.post('/getPermissionByRoles', controller.getPermissionByRoles);// get data
// router.post('/deleteUserRole', controller.deleteUserRole);
module.exports = router;