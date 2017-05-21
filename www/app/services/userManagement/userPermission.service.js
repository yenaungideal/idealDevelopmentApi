'use strict';

App.factory('svrUserPermission', ['$rootScope', function ($rootScope) {

    var currentUserPermissions;
    var TimeLogPermissions;

    function rebind() {
        currentUserPermissions = JSON.parse($rootScope.currentUser.permissions);
        return currentUserPermissions;
    }

    function getUserPermissions() {
        if (currentUserPermissions === undefined || currentUserPermissions === null) {
            return rebind();
        } else {
            return currentUserPermissions;
        }
    }

    return {
        rebind: rebind,
        getUserPermissions: getUserPermissions
    };

}]);



