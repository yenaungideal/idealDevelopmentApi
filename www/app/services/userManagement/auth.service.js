'use strict';


App.factory('svrAuth', function(svrHttp, $window) {
    var storage = $window.localStorage;

    //create data 
    function authenticate(user, password, callback) {
        var option = {
            method: 'POST',
            url: 'auth',
            payload: { user: user, password: password }
        };
        debugger

        svrHttp.connectServer(option, function(result) {
            if (result.statusBool) {
                storage.setItem("userCache", btoa(JSON.stringify(result.data)));
            }
            callback(result);
        });
    }

    //createLogoutHistory  
    function createLogoutHistory(user, callback) {
        var option = {
            method: 'POST',
            url: 'auth/createLogoutHistory',
            payload: user
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }

    //getLogHistory
    function getLogHistory(searchParam, callback) {
        var option = {
            method: 'POST',
            url: 'auth/getLogHistory',
            payload: searchParam
        };

        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
    }


    //invalidLogInProcess  
    function invalidLogInProcess(userName, callback) {
        var option = {
            method: 'POST',
            url: 'auth/invalidLogInProcess',
            payload: userName
        };

        svrHttp.connectServer(option, function(result) {
            callback(result);
        });
    }

    function logout() {
        storage.removeItem("userCache");
    }

    return {
        authenticate: authenticate,
        createLogoutHistory: createLogoutHistory,
        getLogHistory:getLogHistory,
        invalidLogInProcess: invalidLogInProcess,
        logout: logout
    };

});
