 'use strict';

 App.controller('ctrlHeader', function ($rootScope, $scope, svrMenu, svrUserPermission) {
     debugger
     $scope.menuItems = [];
     $rootScope.$watch('showNav', function (newValue, oldValue) {
         
         if (newValue) {
             debugger
             var userPermission = svrUserPermission.getUserPermissions();
             svrMenu.getMenu(userPermission, function (formattedMenu) {
                 debugger
                 $scope.menuItems = formattedMenu;
             });
         }
     });

     $scope.hideMenu = function () {
         if ($rootScope.currentUser !== undefined) {
             return $rootScope.currentUser.forcePasswordChange;
         } else {
             return false;
         }
     }
 });





