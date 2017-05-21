'use strict';
var express = require('express');
var router = express.Router();

var controller = require('./user.controller');

router.get('/', controller.index);//select data for view
 router.get('/:_id', controller.indexbyId);// select data to edit
 router.post('/create', controller.create);// create data
 router.post('/update', controller.update);
// router.post('/getWorkFlowDataByModule', controller.indexbyModule);// select data to edit
 router.post('/getEmployee/getEmployeeData', controller.getEmployee);//select Employee data
 router.post('/getEmployee/getEmployeeDataInEditState', controller.getEmployeeDataInEditState);//select Employee data 
router.get('/getRole/getRoleData', controller.getRole);//select Role data
router.get('/getCompanies/getCompanyDataForGridUI', controller.getCompaniesForGridUI);//select companies data for Grid UI
router.post('/changePassword', controller.changePassword);
router.post('/lock', controller.lock);
router.post('/resetPassword', controller.resetPassword);
module.exports = router;