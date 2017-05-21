'use strict';
App.controller('ctrlPermission', function ($rootScope, $scope, svrPermission, ngDialog) {
    debugger

    $scope.isRequired = false;
    $scope.isChanged = false;


    //Add State
    if ($rootScope.permissionAddNew == -1) {
        clearForm();
    }
        //Edit State
    else {
        $scope.disableModule = true;
        svrPermission.getPermissionByOneRecord($rootScope.permissionAddNew, function (data) {
            $scope.permission = data;
        });
    }

    clearForm();
    //Clear Method
    function clearForm() {
        $scope.permission = {};
    }

    $scope.save = function () {
        debugger
        $scope.isRequired = true;

        if ($scope.permission.module === undefined || $scope.permission.module.length === 0)
            return;

        if ($scope.permission.name === undefined || $scope.permission.name.length === 0)
            return;

        //Save Process
        if ($rootScope.permissionAddNew === -1) {
            // $scope.permission.createdBy = $rootScope.currentUser.name;
            $scope.permission.createdBy = "yenaung";
            svrPermission.createPermission($scope.permission, function (result) {
                if (result !== undefined && result.statusBool !== false) {
                    alertify.success(result.message);
                    clearForm();
                    $scope.closeThisDialog();
                }
                else if (result !== undefined) {
                    if (result.statusHttp == 409) {
                        $scope.customError = result.message;
                    }
                    else {
                        alertify.error(result.message);
                    }
                }
            });
        }
        else {
            // $scope.permission.updatedBy = $rootScope.currentUser.name;
             $scope.permission.updatedBy = "yenaung";
            svrPermission.updatePermission($scope.permission, function (result) {
                if (result !== undefined && result.statusBool !== false) {
                    alertify.success(result.message);
                    clearForm();
                    $scope.closeThisDialog();
                }
                else if (result !== undefined) {
                    if (result.statusHttp == 409) {
                        $scope.customError = result.message;
                    }
                    else {
                        alertify.error(result.message);
                    }
                }
            });
        }
    };

    $scope.cancel = function () {
        if ($scope.isChanged === true) {
        
        $scope.confirm = {
            title: "Confirm",
            message: "Unsaved data will be discarded. Are you sure to close ?"
        }

         ngDialog.open({
                template: 'app/pages/general/confirmation/confirmation.html',
                className: 'ngdialog-theme-default confirmDialog',
                closeByDocument: false,
                closeByEscape: true,
                showClose: false,
                scope:$scope,
                preCloseCallback: function (value) {
                    if (value == true)
                        $scope.closeThisDialog();
                }
            });
        }
        else {
            $scope.closeThisDialog();
        }
    };

    $scope.$on('ngDialog.opened', function (event, $dialog) {
        $dialog.find('.ngdialog-content').css('min-width', '55%').css('background', 'white').css('padding', '0').css('height', '225');
    });

});





























