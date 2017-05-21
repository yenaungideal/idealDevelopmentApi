'use strict';
var user = require('../../../service/userManagement/user');

exports.index = function (req, res) {
    user.read.getRecord(function (result) {
        res.json(result);
    });
};

exports.getEmployee = function (req, res) {
    user.read.getRecord(function (result) {
        var data = result;
        var empIDArray = [];
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].emp !== undefined) {
                    if (data[i].emp.length > 0) {
                        for (var j = 0; j < data[i].emp.length; j++) {
                            if (data[i].emp[j].isActive === true) {
                                var obj = {};
                                obj.ref = data[i].emp[j].ref;
                                empIDArray.push(obj);
                            }
                        }
                    }
                }
            }
        }

        var empArray = empIDArray;

        var array = [];
        for (var i = 0; i < empArray.length; i++) {
            array.push(empArray[i].ref);
        }

        user.read.getEmployee(array, function (result) {
            var data = result;
            var arrayobj = []
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                obj.id = data[i]._id;
                obj.name = data[i].empId + " - " + data[i].name + ' - ' + data[i].status;
                obj.designation = data[i].designation;
                arrayobj.push(obj);
            }
            var empObj = {};
            empObj.empArray = arrayobj;
            res.json(empObj);
        });
    });
};

exports.getEmployeeDataInEditState = function (req, res) {
    user.read.getRecord(function (result) {
        var data = result;

        var empIDArray = [];
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].emp !== undefined) {
                    if (data[i].emp.length > 0) {
                        for (var j = 0; j < data[i].emp.length; j++) {

                            if (data[i].emp[j].isActive === true) {
                                var empObj = returnJSONForEmployee(req.body, data[i].emp[j].ref)
                                if (empObj === false) {
                                    var obj = {};
                                    obj.ref = data[i].emp[j].ref;
                                    empIDArray.push(obj);
                                }
                            }
                        }
                    }
                }
            }
        }

        var array = [];
        for (var i = 0; i < empIDArray.length; i++) {
            array.push(empIDArray[i].ref);
        }

        user.read.getEmployee(array, function (result) {

            var arrayobj = []
            for (var i = 0; i < result.length; i++) {
                var obj = {};
                obj.id = result[i]._id;
                obj.name = result[i].empId + " - " + result[i].name + ' - ' + result[i].status;
                obj.designation = result[i].designation;
                arrayobj.push(obj);
            }

            var empObj = {};
            empObj.empArray = arrayobj;
            res.json(empObj);
        });
    });
};

exports.indexbyId = function (req, res) {
    var option = {};
    if (req.params._id !== undefined) {
        option._id = req.params._id;
    }

    user.read.getOneRecord(option, function (result) {
        res.json(result);
    });
};

exports.getRole = function (req, res) {
    user.read.getRole(function (result) {
        var arrayobj = []
        for (var i = 0; i < result.length; i++) {
            var obj = { id: "" + result[i]._id, name: result[i].name };
            arrayobj.push(obj);
        }
        var obj = {};
        obj.role = arrayobj;
        res.json(obj);
    });
};

exports.getCompaniesForGridUI = function (req, res) {
    user.read.getCompanies(function (result) {
        var array = [];
        for (var j = 0; j < result.length; j++) {
            if (result[j].isActive === true)
                var dep = result[j].department;
            for (var i = 0; i < dep.length; i++) {
                if (dep[i].isActive === true) {
                    array.push({ "companyId": result[j]._id, "companyName": result[j].name, "departmentId": dep[i]._id, "departmentName": dep[i].name });
                }
            };
        }
        res.json(array);
    });
};

exports.create = function (req, res) {
    user.create.createRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

exports.update = function (req, res) {
    user.update.updateRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

exports.changePassword = function (req, res) {
    user.update.changePassword(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

exports.lock = function (req, res) {
    user.update.lockRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

exports.resetPassword = function (req, res) {
    user.update.resetPassword(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};