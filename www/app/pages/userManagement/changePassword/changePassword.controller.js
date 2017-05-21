'use strict';

App.controller('ctrlChangePassword', function ($rootScope, $scope, svrUser, ngDialog, $filter) {
    //var spinner = new Spinner($rootScope.spinnerOptions);
    $scope.isRequired = false;
    $scope.save = function () {
        //var target = document.getElementById('changePasswordForm');
        //spinner.spin(target);
        $scope.isRequired = true;
        
        if ($scope.userManagement.currentPassword === undefined || $scope.userManagement.currentPassword.length === 0)
            return;

        if ($scope.userManagement.newPassword === undefined || $scope.userManagement.newPassword.length === 0)
            return;

        if ($scope.userManagement.confirmPassword === undefined || $scope.userManagement.confirmPassword.length === 0)
            return;

        $scope.userManagement._id = $rootScope.currentUser._id;
        $scope.userManagement.name = $rootScope.currentUser.name;
        debugger
        svrUser.changePassword($scope.userManagement, function (result) {
            
            if (result !== undefined && result.statusBool !== false) {
                $scope.isRequired = false;
                alertify.success(result.message);
                clear();
                //spinner.stop(target);
                window.location = "/#/index";
                $rootScope.currentUser.forcePasswordChange = false;
 
            }
            else if (result !== undefined) {
                alertify.error(result.message);
                //spinner.stop(target);
            }
        });
    };

    function clear() {
        $scope.userManagement.currentPassword = "";
        $scope.userManagement.newPassword = "";
        $scope.userManagement.confirmPassword = "";
    }

    $scope.inputType = 'password';

    // Hide & show password function
    $scope.hideShowPassword = function () {
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };

});




























