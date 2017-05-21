'use strict';

App.factory('svrPermission', function(svrHttp) {

    //select data for view
    function getPermissions(callback) {
        var option = {
            method: 'GET',
            url: 'userManagement/permission/',
            payload: ''
        };

        svrHttp.connectServer(option, function(result) {
            callback(result);
        });
    }

    //select data for edit state 
    function getPermissionByOneRecord(permission, callback) {
        var option = {
            method: 'GET',
            url: 'userManagement/permission/',
            payload: permission
        };

        svrHttp.connectServer(option, function(result) {
            callback(result);
        });
    }

    //create data 
    function createPermission(permission, callback) {
        var option = {
            method: 'POST',
            url: 'userManagement/permission/create',
            payload: permission
        };

        svrHttp.connectServer(option, function(result) {
            callback(result);
        });
    }

    function updatePermission(permission, callback) {
        var option = {
            method: 'PUT',
            url: 'userManagement/permission/update',
            payload: permission
        };

        svrHttp.connectServer(option, function(result) {
            callback(result);
        });
    }

    return {
        getPermissions: getPermissions,
        getPermissionByOneRecord: getPermissionByOneRecord,
        createPermission: createPermission,
        updatePermission: updatePermission  
    };

});
