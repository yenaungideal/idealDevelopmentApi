'use strict';


App.factory('svrUser', function (svrHttp) {

    //get user data
    function getUser(callback) {
        var option = {
            method: 'GET',
            url: 'userManagement/user',
            payload: ''
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    //select data for edit state 
    function getEmployeeByOneRecord(userManagement, callback) {
        var option = {
            method: 'GET',
            url: 'userManagement/user/',
            payload: userManagement
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }   

    //create data 
    function createUserManagement(userManagement, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/user/create',
            payload: userManagement
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    } 

    //update data
    function updateUserManagement(userManagement, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/user/update',
            payload: userManagement
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    //change password
    function changePassword(userManagement, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/user/changePassword',
            payload: userManagement
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    //reset password
    function resetPassword(userManagement, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/user/resetPassword',
            payload: userManagement
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    function getRole(callback) {
        var option = {
            method: 'GET',
            url: 'userManagement/user/getRole/getRoleData',
            payload: ''
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    function getEmployee(empIDArray, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/user/getEmployee/getEmployeeData',
            payload: empIDArray
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    function getEmployeeDataInEditState(empIDArray, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/user/getEmployee/getEmployeeDataInEditState',
            payload: empIDArray
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    //lock data
    function lock(userManagement, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/user/lock',
            payload: userManagement
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    function getCompanyForGridUI(callback) {
        var option = {
            method: 'GET',
            url: 'userManagement/user/getCompanies/getCompanyDataForGridUI',
            payload: ''
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    ////compare password
    //function comparePassword(userManagement, callback) {
    //    var option = {
    //        method: 'POST',
    //        url: 'general/common/comparePassword',
    //        payload: userManagement
    //    };

    //    svrHttp.connectServer(option, function (result) {
    //        callback(result);
    //    });
    //}

    //function getEmployeeRecordByName(userManagement, callback) {
    //    var option = {
    //        method: 'GET',
    //        url: 'userManagement/user/getEmployeeRecordByName/',
    //        payload: userManagement
    //    };

    //    svrHttp.connectServer(option, function (result) {
    //        callback(result);
    //    });
    //}

    //function getOperations(callback) {
    //    var option = {
    //        method: 'GET',
    //        url: 'userManagement/user/getOperations/getOperationsData',
    //        payload: ''
    //    };

    //    svrHttp.connectServer(option, function (result) {
    //        callback(result);
    //    });
    //}

    //function getCompany(callback) {
    //    var option = {
    //        method: 'GET',
    //        url: 'userManagement/user/getCompanies/getCompanyData',
    //        payload: ''
    //    };

    //    svrHttp.connectServer(option, function (result) {
    //        callback(result);
    //    });
    //}

    //function getCompanyDataInEditState(userManagement, callback) {
        
    //    var option = {
    //        method: 'POST',
    //        url: 'userManagement/user/getCompanies/getCompanyDataInEditState',
    //        payload: userManagement
    //    };

    //    svrHttp.connectServer(option, function (result) {
    //        callback(result);
    //    });
    //}   

    //function getOperationsByRoleID(roleObject, callback) {
    //    var option = {
    //        method: 'POST',
    //        url: 'userManagement/user/getOperationsByRoleID/getOperationsByRoleIDData',
    //        payload: roleObject
    //    };

    //    svrHttp.connectServer(option, function (result) {
    //        callback(result);
    //    });
    //}

    //function getLoggedUserRef(loggedUserName, callback) {
    //    var option = {
    //        method: 'GET',
    //        url: 'userManagement/user/getEmployeeRecordByName/' + loggedUserName,
    //        payload: ''
    //    };

    //    svrHttp.connectServer(option, function (result) {
    //        callback(result);
    //    });
    //}

    return {
        getUser: getUser,
        getEmployee: getEmployee,
        getEmployeeDataInEditState:getEmployeeDataInEditState,
        getRole: getRole,
        getCompanyForGridUI: getCompanyForGridUI,
        createUserManagement: createUserManagement,
        updateUserManagement: updateUserManagement,
        getEmployeeByOneRecord: getEmployeeByOneRecord,
        changePassword: changePassword,
        lock: lock,
        resetPassword: resetPassword

        //getOperations: getOperations,
        //getCompany: getCompany,
        //getCompanyDataInEditState: getCompanyDataInEditState,
        //getEmployeeRecordByName:getEmployeeRecordByName,
        //getOperationsByRoleID: getOperationsByRoleID,
        //comparePassword: comparePassword,        
        //getLoggedUserRef: getLoggedUserRef
    };
});