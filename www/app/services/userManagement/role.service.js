'use strict';

App.factory('svrRole', function (svrHttp) {

    //get role data
    function getRole(callback) {
        var option = {
            method: 'GET',
            url: 'userManagement/role',
            payload: ''
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    //select data for edit state 
     function getRoleByOneRecord(roleManagement, callback) {
         var option = {
             method: 'GET',
             url: 'userManagement/role/',
             payload: roleManagement
         };

         svrHttp.connectServer(option, function (result) {
             callback(result);
         });
     }

    //create data 
     function createRoleManagement(roleManagement, callback) {
         var option = {
             method: 'POST',
             url: 'userManagement/role/create',
             payload: roleManagement
         };

         svrHttp.connectServer(option, function (result) {
             callback(result);
         });
     }

    //update data
     function updateRoleManagement(roleManagement, callback) {
         var option = {
             method: 'POST',
             url: 'userManagement/role/update',
             payload: roleManagement
         };

         svrHttp.connectServer(option, function (result) {
             callback(result);
         });
     }

     function getOperations(callback) {
         var option = {
             method: 'GET',
             url: 'userManagement/role/getOperations/getOperationsData',
             payload: ''
         };

         svrHttp.connectServer(option, function (result) {
             callback(result);
         });
     }

    // function getPermissionByRoles(roleManagement, callback) {
    //     var option = {
    //         method: 'POST',
    //         url: 'userManagement/role/getPermissionByRoles',
    //         payload: roleManagement
    //     };

    //     svrHttp.connectServer(option, function (result) {
    //         callback(result);
    //     });
    // }

    // function deleteUserRole(permission, callback) {
    //     var option = {
    //         method: 'POST',
    //         url: 'userManagement/role/deleteUserRole',
    //         payload: permission
    //     };

    //     svrHttp.connectServer(option, function (result) {
    //         callback(result);
    //     });
    // }

    return {
        getRole: getRole,
        getOperations: getOperations,
        getRoleByOneRecord: getRoleByOneRecord,
        createRoleManagement: createRoleManagement,
        updateRoleManagement: updateRoleManagement
        // getPermissionByRoles:getPermissionByRoles,
        // deleteUserRole: deleteUserRole
    };
});