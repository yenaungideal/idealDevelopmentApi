'use strict';
var UserModel = require('../../../model/userManagement/user/user.model').model;
var GeEmailModel = require('../../../model/general/email.model').model;
var Common = require('../../general/common/');
var ReadTemplate = require('../../general/template');
var ReadUser = require('./');
var _ = require('lodash');
var mongoose = require('mongoose');
var ejs = require('ejs');

exports.updateRecord = function (payLoad, resultData) {

    var response = {};
    var userCompany = [];
    var userRole = [];
    var userEmp = [];
    var selectedRole = [];
    var selectedEmp = [];
    var selectedCompany = [];
    var isValid = true;
    //pageStatus is coming from Login Authentication.
    var pageStatus;
    if (payLoad.pageStatus !== undefined) {
        pageStatus = payLoad.pageStatus;
    } else {
        pageStatus = undefined;
    }

    if (pageStatus === undefined && pageStatus !== "auth") {
        //Validations
        if (payLoad.name === "" || payLoad.name === undefined || payLoad.name.length === 0) {
            //Check User having name
            response.message = "Name is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
            isValid = false;
        }
        else if (payLoad.role === "" || payLoad.role === undefined || payLoad.role.length === 0) {
            //Check User having role
            response.message = "Role is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
            isValid = false;
        }
        else if (payLoad.email === "" || payLoad.email === undefined || payLoad.email.length === 0) {
            //Check User having email
            response.message = "Email is required";
            response.statusHttp = 412;
            response.statusBool = false;
            processMessage(true);
            isValid = false;
        }
    }

    if (isValid) {
        if (payLoad.isActive === false) {
            //console.log("----step0----");
            UserModel.update({ _id: payLoad._id }, { $set: { 'isActive': false, 'updatedBy': payLoad.updatedBy, 'updatedDate': new Date() } }, processMessageForDelete);
        } else {

            payLoad.updatedDate = new Date();
            if (pageStatus === undefined && pageStatus !== "auth") {
                //Check for unique email
                var option = { id: payLoad._id, email: payLoad.email };
                ReadUser.read.getDuplicateRecordByEmailInEdit(option, processUniqueValidationForEmail);

            } else {
                UserModel.update({ _id: payLoad._id }, { $set: payLoad }, processMessage);
            }
        }
    }

    function processUniqueValidationForEmail(result) {
        if (result !== null) {
            response.message = "Email Address already exists";
            response.statusHttp = 409;
            response.statusBool = false;
            isValid = false;
        }
        else {
            isValid = true;
        }
        processRecord();
    }

    function processRecord() {
        if (isValid) {
            selectedRole = payLoad.role;
            selectedEmp = payLoad.emp;
            selectedCompany = payLoad.company;
            delete payLoad.role;
            delete payLoad.emp;
            delete payLoad.company;

            ReadUser.read.getOneRecord({ _id: payLoad._id }, processToUpdate);
            function processToUpdate(res) {
                userCompany = res.company;
                userRole = res.role;
                userEmp = res.emp;
                convertSelectedRole();
                convertSelectedEmp();
                convertSelectedCompany();
                UserModel.update({ _id: payLoad._id }, { $set: payLoad }).then(pushNewRole).then(updateExistingRole).then(deleteExistingRole).then(pushNewEmp).then(updateExistingEmp).then(deleteExistingEmp).then(deleteExistingCmp).then(updateExistingCmp).then(pushNewCmp).then(responseMessage);
            }
        }
        else {
            processMessage(true);
        }
    }

    function convertSelectedRole() {
        var tmpRole = [];
        selectedRole.forEach(function prepareSelectedRole(row, index) {
            //changing json value to mongo objectId by mongoose.
            var ref = mongoose.mongo.ObjectId(row.ref);
            var obj = { "ref": ref, "name": row.name };
            tmpRole.push(obj);
        });
        selectedRole = tmpRole;
    }

    function convertSelectedEmp() {
        var tmpEmp = [];
        selectedEmp.forEach(function prepareSelectedEmp(row, index) {
            //changing json value to mongo objectId by mongoose.
            var ref = mongoose.mongo.ObjectId(row.ref);
            var obj = { "ref": ref, "number": row.number };
            tmpEmp.push(obj);
        });
        selectedEmp = tmpEmp;
    }

    function convertSelectedCompany() {
        var tmpCmp = [];
        selectedCompany.forEach(function prepareSelectedCompany(row, index) {
            //changing json value to mongo objectId by mongoose.
            var ref = mongoose.mongo.ObjectId(row.ref);
            var obj = { "ref": ref, "department": [] };

            row.department.forEach(function prepareSelectedDepartment(row, index) {
                var ref = mongoose.mongo.ObjectId(row.ref);
                obj.department.push({ "ref": ref });
            });

            tmpCmp.push(obj);
        });
        selectedCompany = tmpCmp;
    }

    //-----------------------------------------------------------------Role Data Updating---------------------------------------------//

    function pushNewRole() {
        var newRole = [];
        selectedRole.forEach(function prepareNewRole(row, index) {
            var value = _.find(userRole, { "ref": row.ref });
            if (value === undefined) {
                newRole.push(row);
            }
        });
        console.log("--new Role--");
        console.log(newRole);

        if (newRole.length > 0) {
            try {
                var i = 0;
                checkAndUpdate();
                function checkAndUpdate() {
                    if (i >= newRole.length) {
                        console.log("----------pass new role-----------");
                    } else {
                        var tmp = newRole[i];
                        console.log("--tmp--");
                        console.log(tmp);
                        UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id) }, { $push: { "role": tmp } })
                            .then(function (data) {
                                i += 1;
                                checkAndUpdate();
                            });
                    }
                }
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }
    }

    function updateExistingRole() {

        var updateRole = [];
        var deletedRole = [];
        deletedRole = _.filter(userRole, { isActive: false });
        deletedRole.forEach(function prepareUpdateRole(row, index) {
            var value = _.find(selectedRole, { 'ref': row.ref });
            if (value !== undefined) {
                updateRole.push(row);
            }
        });

        console.log("--update Role--");
        console.log(updateRole);
        if (updateRole.length > 0) {
            try {
                var i = 0;
                checkAndUpdate();
                function checkAndUpdate() {
                    if (i >= updateRole.length) {
                        console.log("----------pass update role-----------");
                    } else {
                        var tmp = updateRole[i];
                        UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id), "role.ref": mongoose.Types.ObjectId(tmp.ref) }, { $set: { "role.$.isActive": true } })
                            .then(function (data) {
                                i += 1;
                                checkAndUpdate();
                            });
                    }
                }
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }
    }

    function deleteExistingRole() {
        var deleteRole = [];
        userRole.forEach(function prepareDeleteRole(row, index) {
            var value = _.find(selectedRole, { 'ref': row.ref });
            if (value === undefined) {
                deleteRole.push(row);
            }
        });
        console.log("--delete Role--");
        console.log(deleteRole);
        if (deleteRole.length > 0) {
            try {
                var i = 0;
                checkAndUpdate();
                function checkAndUpdate() {
                    if (i >= deleteRole.length) {
                        console.log("----------pass delete role-----------");
                    } else {
                        var tmp = deleteRole[i];
                        UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id), "role.ref": mongoose.Types.ObjectId(tmp.ref) }, { $set: { "role.$.isActive": false } })
                            .then(function (data) {
                                i += 1;
                                checkAndUpdate();
                            });
                    }
                }
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }
    }

    //-----------------------------------------------------------------Employee Data Updating---------------------------------------------//
    function pushNewEmp() {
        var newEmp = [];
        selectedEmp.forEach(function prepareNewEmp(row, index) {
            var value = _.find(userEmp, { "ref": row.ref });
            if (value === undefined) {
                newEmp.push(row);
            }
        });
        console.log("--new Emp--");
        console.log(newEmp);

        if (newEmp.length > 0) {
            try {
                var i = 0;
                checkAndUpdate();
                function checkAndUpdate() {
                    if (i >= newEmp.length) {
                        console.log("----------pass new emp-----------");
                    } else {
                        var tmp = newEmp[i];
                        UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id) }, { $push: { "emp": tmp } })
                            .then(function (data) {
                                i += 1;
                                checkAndUpdate();
                            });
                    }
                }
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }
    }

    function updateExistingEmp() {
        var updateEmp = [];
        var deletedEmp = [];
        deletedEmp = _.filter(userEmp, { isActive: false });
        deletedEmp.forEach(function prepareUpdateEmp(row, index) {
            var value = _.find(selectedEmp, { 'ref': row.ref });
            if (value !== undefined) {
                updateEmp.push(row);
            }
        });

        console.log("--update Emp--");
        console.log(updateEmp);
        if (updateEmp.length > 0) {
            try {
                var i = 0;
                checkAndUpdate();
                function checkAndUpdate() {
                    if (i >= updateEmp.length) {
                        console.log("----------pass update emp-----------");
                    } else {
                        var tmp = updateEmp[i];
                        UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id), "emp.ref": mongoose.Types.ObjectId(tmp.ref) }, { $set: { "emp.$.isActive": true } })
                            .then(function (data) {
                                i += 1;
                                checkAndUpdate();
                            });
                    }
                }
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }
    }

    function deleteExistingEmp() {
        var deleteEmp = [];
        userEmp.forEach(function prepareDeleteEmp(row, index) {
            var value = _.find(selectedEmp, { 'ref': row.ref });
            if (value === undefined) {
                deleteEmp.push(row);
            }
        });
        console.log("--delete emp--");
        console.log(deleteEmp);
        if (deleteEmp.length > 0) {
            try {
                var i = 0;
                checkAndUpdate();
                function checkAndUpdate() {
                    if (i >= deleteEmp.length) {
                        console.log("----------pass delete emp-----------");
                    } else {
                        var tmp = deleteEmp[i];
                        UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id), "emp.ref": mongoose.Types.ObjectId(tmp.ref) }, { $set: { "emp.$.isActive": false } })
                            .then(function (data) {
                                i += 1;
                                checkAndUpdate();
                            });
                    }
                }
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }
    }

    //-----------------------------------------------------------------Company Data Updating---------------------------------------------//
    var newCmp = [];
    function pushNewCmp() {
        selectedCompany.forEach(function prepareNewCompany(row, index) {
            var tmpDepartment = [];
            var createdCmp = _.find(userCompany, { "ref": row.ref });
            if (createdCmp !== undefined) {
                var createdDep = createdCmp.department;
                var selectedDep = row.department;
                selectedDep.forEach(function prepareDepartment(row, index) {
                    var value = _.filter(createdDep, { "ref": row.ref });
                    if (value.length == 0) {
                        tmpDepartment.push(row);
                    }
                });

                if (tmpDepartment.length > 0) {
                    newCmp.push({ "ref": row.ref, "department": tmpDepartment, "isActive": true });
                }
            } else {
                newCmp.push(row);
            }
        });

        console.log("-***********************-new cmp-******************************8-");
        console.log(newCmp);

        if (newCmp.length > 0) {
            ReadUser.read.getOneRecord({ _id: payLoad._id }, pushNewCompanyProcessing);
        }
    }

    var updateCmp = [];
    function updateExistingCmp() {
        //prepare updateCmp;
        userCompany.forEach(function prepareUpdateCompany(row, index) {
            var tmpDepartment = [];
            var selectedCmp = _.find(selectedCompany, { "ref": row.ref });
            if (selectedCmp !== undefined) {
                var selectedDep = selectedCmp.department;
                var delectedDep = _.filter(row.department, { isActive: false });
                delectedDep.forEach(function prepareUpdateDep(row, index) {
                    var value = _.find(selectedDep, { "ref": row.ref });
                    if (value !== undefined) {
                        tmpDepartment.push(row);
                    }
                });

                if (tmpDepartment.length > 0) {
                    updateCmp.push({ "ref": row.ref, "department": tmpDepartment, "isActive": true });
                }
            }
        });
        console.log("-***********************-update cmp-******************************8-");
        console.log(updateCmp);
        if (updateCmp.length > 0) {
            try {
                for (var j = 0; j < updateCmp.length; j++) {
                    var cmpRef = updateCmp[j].ref;
                    var tmpDep = updateCmp[j].department;

                    var i = 0;
                    checkAndUpdate();
                    function checkAndUpdate() {
                        if (i >= tmpDep.length) {
                            console.log("----------pass update cmp-----------");
                        } else {
                            var tmp = tmpDep[i];
                            //console.log("----check---");
                            //console.log("id : " + payLoad._id + " cmpid : " + cmpRef + " depid : " + tmp.ref);
                            var obj = getDepIndex(cmpRef, tmp.ref, userCompany)
                            var index = obj.depIndex;
                            var jsonKey = "company.$.department." + index + ".isActive";
                            var jsonCmp = "company.$.isActive";
                            var jsonVariable = {};
                            jsonVariable[jsonKey] = true;
                            jsonVariable[jsonCmp] = true;
                            UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id), "company.ref": mongoose.Types.ObjectId(cmpRef), "company.department.ref": mongoose.Types.ObjectId(tmp.ref) }, { $set: jsonVariable })
                                .then(function (data) {
                                    i += 1;
                                    checkAndUpdate();
                                });
                        }
                    }
                }
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }
    }

    var deleteCmp = []
    function deleteExistingCmp() {
        userCompany.forEach(function prepareUpdateCompany(row, index) {
            var userDepartment = row.department;
            var selectedCmp = _.find(selectedCompany, { ref: row.ref });
            if (selectedCmp !== undefined) {

                var tmpDepartment = [];
                var selectedDep = selectedCmp.department;
                userDepartment.forEach(function prepareCompany(row, index) {
                    var value = _.find(selectedDep, { ref: row.ref });
                    if (value === undefined) {
                        tmpDepartment.push({ "ref": row.ref, "isActive": false });
                    } else {
                        tmpDepartment.push({ "ref": row.ref, "isActive": true });
                    }
                });

                if (tmpDepartment.length > 0) {
                    deleteCmp.push({ "ref": row.ref, "department": tmpDepartment, "isActive": true });
                }
            }
            else {

                var tmpDepartment = [];
                userDepartment.forEach(function preparedepartment(row, index) {
                    if (row.isActive == true) {
                        tmpDepartment.push({ "ref": row.ref, "isActive": false });
                    }
                });

                if (tmpDepartment.length > 0) {
                    deleteCmp.push({ "ref": row.ref, "department": tmpDepartment, "isActive": false });
                }
            }
        });

        console.log("-***********************-delete cmp-******************************8-");
        console.log(deleteCmp);
        if (deleteCmp.length > 0) {
            try {
                deleteCmp.forEach(function processCmp(row, index) {

                    var cmpRef = row.ref;
                    var tmpDep = row.department;

                    //check isActive true department
                    var value = _.find(tmpDep, { "isActive": true });
                    console.log("--value---");
                    console.log(value);
                    if (value !== undefined) {

                        var i = 0;
                        checkAndUpdate();
                        function checkAndUpdate() {
                            if (i == tmpDep.length) {
                                console.log("----------pass delete cmp-----------");
                            } else {
                                var tmp = tmpDep[i];
                                var obj = getDepIndex(cmpRef, tmp.ref, userCompany)
                                var index = obj.depIndex;
                                var jsonKey = "company.$.department." + index + ".isActive";
                                var jsonVariable = {};
                                jsonVariable[jsonKey] = tmpDep[i].isActive;
                                UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id), "company.ref": mongoose.Types.ObjectId(cmpRef), "company.department.ref": mongoose.Types.ObjectId(tmp.ref) }, { $set: jsonVariable })
                                    .then(function (data) {
                                        i += 1;
                                        checkAndUpdate();
                                    });
                            }
                        }
                    } else {

                        var i = 0;
                        checkAndUpdate();
                        function checkAndUpdate() {
                            if (i == tmpDep.length) {
                                console.log("----------pass delete parent-----------");
                            } else {
                                var tmp = tmpDep[i];
                                var obj = getDepIndex(cmpRef, tmp.ref, userCompany)
                                var index = obj.depIndex;
                                var jsonKey = "company.$.department." + index + ".isActive";
                                var jsonCmp = "company.$.isActive";
                                var jsonVariable = {};
                                jsonVariable[jsonKey] = tmpDep[i].isActive;
                                jsonVariable[jsonCmp] = false;
                                console.log("---------json variable---------");
                                console.log(jsonVariable);
                                UserModel.update({ _id: mongoose.Types.ObjectId(payLoad._id), "company.ref": mongoose.Types.ObjectId(cmpRef), "company.department.ref": mongoose.Types.ObjectId(tmp.ref) }, { $set: jsonVariable })
                                    .then(function (data) {
                                        i += 1;
                                        checkAndUpdate();
                                    });
                            }
                        }
                    }
                });
            }
            catch (err) {
                //true mean error is existed.
                status = true;
            }
        }

    }

    function getDepIndex(cmpRef, depRef, userCompany) {
        var obj = {};
        obj.cmpIndex = _.findIndex(userCompany, { 'ref': mongoose.Types.ObjectId(cmpRef) });
        var company = _.find(userCompany, { 'ref': mongoose.Types.ObjectId(cmpRef) });
        var department = company.department;
        obj.depIndex = _.findIndex(department, { 'ref': mongoose.Types.ObjectId(depRef) });
        return obj;
    }

    var status = false;

    function pushNewCompanyProcessing(result) {
        var tmpCmp = result.company;
        try {
            for (var i = 0; i < newCmp.length; i++) {

                var value = _.find(tmpCmp, { "ref": mongoose.Types.ObjectId(newCmp[i].ref) });
                if (value !== undefined && value !== null) {
                    var obj = { "ref": newCmp[i].ref, "department": newCmp[i].department };
                    pushNewDepartment(obj, response)
                }
                else {
                    var obj = { "company": newCmp[i] };
                    pushNewCompanyAndDepartment(obj, response)
                }
            }
        }
        catch (err) {
            //true mean error is existed.
            status = true;
        }
        console.log("----------pass new company save-----------");
    }

    //Push New Department to Existed Company.
    function pushNewDepartment(obj, response) {
        var i = 0;
        checkAndUpdate();
        function checkAndUpdate() {
            if (i >= obj.department.length) {
                UserModel.update({ "_id": mongoose.Types.ObjectId(payLoad._id), "company.ref": obj.ref }, { "$set": { "company.$.isActive": true } }, function () {
                    return response;
                })
            } else {
                var tmp = obj.department[i];

                UserModel.update({ "_id": mongoose.Types.ObjectId(payLoad._id), "company.ref": obj.ref }, {
                    "$push": {
                        "company.$.department": {
                            ref: tmp.ref
                        }
                    }
                }, tempFunction)
            }
            function tempFunction(res1) {
                i += 1;
                checkAndUpdate();
            }
        }
    }

    //Push New Company And Department.
    function pushNewCompanyAndDepartment(obj, response) {
        UserModel.update({ "_id": mongoose.Types.ObjectId(payLoad._id) }, {
            "$push": {
                "company": obj.company
            }
        }, tempFunction);

        function tempFunction(res1) {
            return response;
        }
    }

    function responseMessage() {
        processMessage(status);
    }

    function processMessage(err) {
        if (!err) {
            response.message = "Updated Sucessfully";
            response.statusHttp = 200;
            response.statusBool = true;
        } else {
            if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                response.statusHttp = 500;
                response.statusBool = false;
            }

            if (response.message === undefined || response.message.length === 0) {
                response.message = "Error while update data";
                response.rawError = err;
            }
        }

        resultData(response);
    }

    function processMessageForDelete(err) {
        if (!err) {
            response.message = "Deleted Sucessfully";
            response.statusHttp = 200;
            response.statusBool = true;
        } else {
            if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                response.statusHttp = 500;
                response.statusBool = false;
            }

            if (response.message === undefined || response.message.length === 0) {
                response.message = "Error while delete data";
                response.rawError = err;
            }
        }
        resultData(response);
    }

    function returnResponse(statusHttp, statusBool, message, data) {
        resultData({
            statusHttp: statusHttp,
            statusBool: statusBool,
            message: message,
            data: data
        });
    }

};

var oldPassword;
//Change Password take _id,currentPassword,newPassword and confirmPassword.
exports.changePassword = function (payLoad, resultData) {
    var response = {};
    Common.read.passwordComplexity({ "confirmPassword": payLoad.confirmPassword }, function (result) {
        //console.log("---------------result----------");
        //console.log(result);
        if (result.passWordComplexityStatus === true) {

            ReadUser.read.getOneRecord({ "_id": payLoad._id }, function (data) {
                //console.log("OldPassword :" + _.takeRight(data.oldPassword, 3));
                payLoad.oldPassword = data.oldPassword;
                payLoad.encryptedCurrentPassword = data.password;

                Common.read.comparePassword({ "candidatePassword": payLoad.currentPassword, "encryptedPassword": payLoad.encryptedCurrentPassword }, processToValidate);
                function processToValidate(result) {
                    if (result != true) {
                        responseError("Current Password is invalid.Please type valid Password");
                    } else if (payLoad.newPassword != payLoad.confirmPassword) {
                        responseError("New Password And Confirm Password should be same");
                    } else {
                        //compare isOldPassword By currentPassword
                        isOldPassword(isOldPasswordProcess);

                        function isOldPasswordProcess(status) {

                            if (status === true) {
                                responseError("Current Password And New Password should not be same");
                            } else {
                                //compare isLastThreePassword By oldPassword

                                if (data.oldPassword.length > 0) {
                                    oldPassword = _.takeRight(data.oldPassword, 3);
                                    if (oldPassword.length > 0) {
                                        isLastThreeOldPassword(isLastThreeOldPasswordProcess);

                                        function isLastThreeOldPasswordProcess(status) {
                                            if (status === true) {
                                                responseError("New Password should not be same with last three old password");
                                            } else {
                                                changeRecord(payLoad.confirmPassword);
                                            }
                                        }
                                    } else {
                                        changeRecord(payLoad.confirmPassword);
                                    }
                                }
                                else {
                                    changeRecord(payLoad.confirmPassword);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            //console.log("----Step 2----");
            responseError(result.passWordComplexityMessage);
        }
    });

    function isOldPassword(res) {
        Common.read.comparePassword({ "candidatePassword": payLoad.newPassword, "encryptedPassword": payLoad.encryptedCurrentPassword }, function (result) {
            res(result);
        });
    }

    var i = 0;
    var status = false;

    function isLastThreeOldPassword(res) {
        if (status === true) {
            res(status);
        }
        else {
            if (i >= oldPassword.length) {
                res(status);
            } else {
                Common.read.comparePassword({ "candidatePassword": payLoad.newPassword, "encryptedPassword": oldPassword[i].password }, function (result) {
                    i += 1;
                    if (result === true) {
                        status = result;
                    }
                    isLastThreeOldPassword(res);
                });
            }
        }
    }

    function changeRecord(confirmPassword) {
        var option = { password: confirmPassword };
        Common.read.getEncryptionPassword(option, processMessageForPasswordEncryption);
    }

    function processMessageForPasswordEncryption(result) {
        //email sending 
        //sendEmail(payLoad.email, "Login Password Information", payLoad.name, payLoad.newPassword)

        var array = payLoad.oldPassword;
        array.push({ password: payLoad.encryptedCurrentPassword });

        var obj = {};
        obj._id = payLoad._id;
        obj.name = payLoad.name;
        obj.password = result;
        obj.oldPassword = array;
        obj.lastPasswordChanged = new Date();
        obj.forcePasswordChange = false;
        obj.updatedBy = payLoad.name;

        UserModel.update({ _id: obj._id }, { $set: obj }, processMessageForPasswordChange);
    }

    var glUsername;
    var glPassword;
    var glSubject;
    var glTo;

    function sendEmail(to, subject, username, password) {
        glTo = to;
        glUsername = username;
        glPassword = password;
        glSubject = subject;
        ReadTemplate.read.getOneRecord({ name: "userPasswordEmailTemplate" }, processEmail);
    }

    function processEmail(result) {
        if (result != undefined) {
            var obj = result;
            var content = obj.content;

            var ejs = require('ejs');

            /* var username = '$username$';
             var newstr = content.replace(username, glUsername);

             var password = '$password$';
             var newcontent = newstr.replace(password, glPassword);*/
            console.log(content);
            var jsonContent = { userName: glUsername, password: glPassword };
            var newcontent = ejs.render(content, jsonContent);
            console.log(jsonContent);
            console.log(newcontent);

            var obj = {};
            obj.to = glTo;
            obj.cc = "";
            obj.bcc = "";
            obj.subject = glSubject;
            obj.body = newcontent;
            console.log(obj);

            var geEmail = new GeEmailModel(obj);
            geEmail.save();
        }
    }

    function processMessageForPasswordChange(err) {
        {
            if (!err) {
                response.statusHttp = 200;
                response.statusBool = true;
                response.message = "Your password is sucessfully changed.";
            } else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while password changed data.";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }

    function responseError(message) {
        response.statusHttp = 500;
        response.statusBool = false;
        response.message = message;
        console.log("-----------------response-------------");
        console.log(response);
        resultData(response);
    }
};

//Reset Password
exports.resetPassword = function (payLoad, resultData) {

    var response = {};
    try {
        resetRecord();
    } catch (err) {
        console.error(err);
    }
    var cpassword;
    function resetRecord() {
        Common.read.passwordGenerate(processToPasswordEncryprion)
        function processToPasswordEncryprion(result) {
            cpassword = result;
            var option = { password: cpassword };
            Common.read.getEncryptionPassword(option, processMessageForPasswordEncryption);
        }
    }

    function processMessageForPasswordEncryption(result) {
        sendEmail(payLoad.email, "idealFramework Login Information", payLoad.name, cpassword);

        ReadUser.read.getOneRecord({ "_id": payLoad._id }, function (data) {
            var array = data.oldPassword;
            array.push({ password: payLoad.password });

            var obj = {};
            obj._id = payLoad._id;
            obj.name = payLoad.name;
            obj.password = result;
            obj.oldPassword = array;

            UserModel.update({ _id: obj._id, isActive: true }, { $set: { 'password': obj.password, 'oldPassword': obj.oldPassword, 'forcePasswordChange': true, 'updatedBy': payLoad.updatedBy, 'updatedDate': new Date() } }, processMessageForPasswordReset);
        });
    }

    var glUsername;
    var glPassword;
    var glSubject;
    var glTo;

    function sendEmail(to, subject, username, password) {
        glTo = to;
        glUsername = username;
        glPassword = password;
        glSubject = subject;
        ReadTemplate.read.getOneRecord({ name: "userPasswordEmailTemplate" }, processEmail);
    }

    function processEmail(result) {
        if (result != undefined) {
            var obj = result;
            var content = obj.content;

            var username = '$username$';
            var newstr = content.replace(username, glUsername);

            var password = '$password$';
            var newcontent = newstr.replace(password, glPassword);

            var obj = {};
            obj.to = glTo;
            obj.cc = "";
            obj.bcc = "";
            obj.subject = glSubject;
            obj.body = newcontent;            

            var geEmail = new GeEmailModel(obj);
            geEmail.save();
        }
    }

    function processMessageForPasswordReset(err) {
        {
            if (!err) {
                response.statusHttp = 200;
                response.statusBool = true;
                response.message = "Your password is Successfully reset.";
            } else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while password reset data.";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }
};

//lock or unlock data 
exports.lockRecord = function (payLoad, resultData) {
    try {
        var response = {};
        lockRecord();
    } catch (err) {
        console.error(err);
    }

    function lockRecord() {
        if (payLoad.isLocked === true) {
            UserModel.update({ _id: payLoad._id, isActive: true }, { $set: { 'isLocked': true, 'updatedBy': payLoad.updatedBy, 'lastLocked': new Date(), 'updatedDate': new Date() } }, processMessageForLock);
        } else {
            UserModel.update({ _id: payLoad._id, isActive: true }, { $set: { 'isLocked': false, 'updatedBy': payLoad.updatedBy, 'invalidAttemptCount': 0, 'updatedDate': new Date(), "lastLogin": undefined } }, processMessageForUnLock);
        }

    }

    function processMessageForLock(err) {
        {
            if (!err) {
                response.statusHttp = 200;
                response.statusBool = true;
                response.message = "Locked Successfully.";
            } else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while lock data";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }

    function processMessageForUnLock(err) {
        {
            if (!err) {
                response.statusHttp = 200;
                response.statusBool = true;
                response.message = "UnLocked Successfully.";
            } else {
                if (response.statusHttp === undefined || response.statusHttp.length === 0) {
                    response.statusHttp = 500;
                    response.statusBool = false;
                }

                if (response.message === undefined || response.message.length === 0) {
                    response.message = "Error while unlock data";
                    response.rawError = err;
                }
            }
            resultData(response);
        }
    }
};
