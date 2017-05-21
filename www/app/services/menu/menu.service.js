'use strict';

App.factory('svrMenu', function (svrHttp) {
    function getMenu(userPermission, callback) {
        
        var option = {
            method: 'POST',
            url: 'menu/',
            payload: userPermission
        };
        
        svrHttp.connectServer(option, function (result) {
            callback(result);
        });
  }

  return {
    getMenu: getMenu
  };
});
