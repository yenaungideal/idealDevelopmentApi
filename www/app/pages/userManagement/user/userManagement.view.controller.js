'use strict';
App.controller('ctrlUserManagementView', function($rootScope, $scope, ngDialog, $filter,svrUser) {

    //Permissions according to user 
    // $scope.permissions = svrUserPermission.getUserPermissions().userManagement;

    //Delete
     $scope.delete = function(userManagement) {
         $scope.confirm = {
             title: "Confirm",
             message: "Are you sure to delete a record ?"
         }

         ngDialog.open({
             template: 'app/pages/general/confirmation/confirmation.html',
             className: 'ngdialog-theme-default confirmDialog',
             closeByDocument: false,
             closeByEscape: false,
             showClose: false,
             scope: $scope,
             preCloseCallback: function(value) {
                 if (value) {
                     userManagement.isActive = false;
                     userManagement.updatedBy = $rootScope.currentUser.name;
                     svrUser.updateUserManagement(userManagement, function(result) {
                         if (result !== undefined && result.statusBool !== false) {
                             alertify.success(result.message);
                             refreshView();
                         } else if (result !== undefined) {
                             alertify.error(result.message);
                         }
                     });
                 }
             }
         });
     }

    //Edit
    $scope.edit = function(userManagement) {
        
        if (userManagement === undefined) {
            $rootScope.userManagementAddNew = -1;
        } else {
            $rootScope.userManagementAddNew = userManagement._id;
        }
        var ngDialogInstance = ngDialog.open({
            template: 'app/pages/userManagement/user/userManagement.edit.html',
            className: 'ngdialog-theme-default',
            closeByDocument: false,
            closeByEscape: true,
            showClose: false,
            preCloseCallback: function () {
                 $rootScope.company = undefined;
                 $rootScope.userManagementAddNew = undefined;
                 refreshView();
            }
        });
    };

    //IsLock
    $scope.locked = function(userManagement) {
        var status = true;
        var message;
        if (userManagement.isLocked) {
            message = "Are you sure to unlock a user ?";
            status = false;

        } else {
            message = "Are you sure to lock a user ?";
        }

        $scope.confirm = {
            title: "Confirm",
            message: message
        }

        ngDialog.open({
            template: 'app/pages/general/confirmation/confirmation.html',
            className: 'ngdialog-theme-default confirmDialog',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            scope: $scope,
            preCloseCallback: function(value) {
                if (value) {
                    userManagement.updatedBy = $rootScope.currentUser.name;
                    if (status === false) {
                        userManagement.isLocked = false;
                    } else {
                        userManagement.isLocked = true;
                    }
                    svrUser.lock(userManagement, function (result) {
                        if (result !== undefined && result.statusBool !== false) {
                            alertify.success(result.message);
                            refreshView();
                        } else if (result !== undefined) {
                            alertify.error(result.message);
                        }
                    });
                }
            }
        });
    }

    //resetPassword
    $scope.resetPassword = function(userManagement) {
        $scope.confirm = {
            title: "Confirm",
            message: "Password will be sent to your email address. Still want to reset ?"
        }

        ngDialog.open({
            template: 'app/pages/general/confirmation/confirmation.html',
            className: 'ngdialog-theme-default confirmDialog',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            scope: $scope,
            preCloseCallback: function(value) {
                if (value) {
                    userManagement.updatedBy = $rootScope.currentUser.name;
                    svrUser.resetPassword(userManagement, function (result) {
                        if (result !== undefined && result.statusBool !== false) {
                            alertify.success(result.message);
                            refreshView();
                        } else if (result !== undefined) {
                            alertify.error(result.message);
                        }
                    });
                }
            }
        });
    }

     GridOptions();

    function GridOptions() {
        $scope.gridOptions = Object.create($rootScope.gridOptions);
        $scope.gridOptions.enableFiltering = true;
        $scope.gridOptions.enableSorting = true;
        $scope.gridOptions.enableColumnResizing = true;
        $scope.gridOptions.exporterCsvFilename = 'Users.csv';
        $scope.gridOptions.exporterPdfHeader.text = "Users";
        $scope.gridOptions.exporterSuppressColumns = 'Edit,Delete,Reset Password',
            $scope.gridOptions.columnDefs = [{
                    name: 'Edit',
                    enableSorting: false,
                    width: 55,
                    enableFiltering: false,
                    enableColumnMenu: false,
                    //enableHiding: $scope.permissions.user.write,
                    //visible: $scope.permissions.user.write,
                    headerCellClass: 'headerstyle',
                    cellTemplate: '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.edit(row.entity)"><i id="edit" class="fa fa-pencil-square-o"></i> </a> </div>'
                },{
                    name: 'name',
                    enableColumnMenu: false,
                    displayName: 'Login Name',
                    width: 200
                },{
                    name: 'role',
                    enableColumnMenu: false,
                    displayName: 'Role',
                    minWidth: 150

                },{
                    name: 'empNumber',
                    enableColumnMenu: false,
                    displayName: 'Employee Number',
                    width: 150
                },{
                    name: 'email',
                    enableColumnMenu: false,
                    displayName: 'Email',
                    width: 250

                },{
                    name: 'Lock Status',
                    enableColumnMenu: false,
                    enableSorting: true,
                    enableFiltering: false,
                    //enableHiding: $scope.permissions.user.write,
                    //visible: $scope.permissions.user.write,
                    headerCellClass: 'headerstyle',
                    field: 'isLocked',
                    width: 120,
                    cellTemplate: '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.locked(row.entity)"><i class="fa fa-lock" style="font-size:1.5em;color:#F33636"  ng-if="row.entity.isLocked == true"></i> <i class="fa fa-unlock-alt " style="font-size:1.5em;color:blue"  ng-if="row.entity.isLocked == false"></i></a> </div>'
                },{
                    name: 'Reset Password',
                    enableSorting: false,
                    width: 120,
                    enableFiltering: false,
                    enableColumnMenu: false,
                    //enableHiding: $scope.permissions.user.write,
                    //visible: $scope.permissions.user.write,
                    headerCellClass: 'headerstyle',
                    cellTemplate: '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.resetPassword(row.entity)"><i class="fa fa-refresh" style="font-size:1.5em;color:blue"></i> </a> </div>'
                },{
                    name: 'lastLogin',
                    enableColumnMenu: false,
                    visible: false,
                    displayName: 'Success On', cellFilter: 'date:\'dd-MM-yyyy hh:mm\'',
                    width: 150

                },{
                    name: 'lastLocked',
                    enableColumnMenu: false,
                    displayName: 'Locked On', cellFilter: 'date:\'dd-MM-yyyy hh:mm\'',
                    width: 150

                },{
                    name: 'lastPasswordChanged',
                    enableColumnMenu: false,
                    displayName: 'Password Changed On', cellFilter: 'date:\'dd-MM-yyyy hh:mm\'',
                    minWidth: 165

                },{
                    name: 'invalidAttemptCount',
                    enableColumnMenu: false,
                    visible: false,
                    displayName: 'Invalid Attempt Count',
                    minWidth: 150

                },{
                    name: 'createdBy',
                    minWidth: 150,
                    visible: false,
                    displayName: 'Created By',
                    enableColumnMenu: false
                },{
                    name: 'createdDate',
                    minWidth: 150,
                    visible: false,
                    displayName: 'Created Date', cellFilter: 'date:\'dd-MM-yyyy hh:mm\'',
                    enableColumnMenu: false
                  
                },{
                    name: 'updatedBy',
                    minWidth: 150,
                    visible: false,
                    displayName: 'Updated By',
                    enableColumnMenu: false
                },{
                    name: 'updatedDate',
                    minWidth: 150,
                    visible: false,
                    displayName: 'Updated Date', cellFilter: 'date:\'dd-MM-yyyy hh:mm\'',
                    enableColumnMenu: false
                },{
                    name: 'Delete',
                    enableSorting: false,
                    width: 70,
                    enableFiltering: false,
                    enableColumnMenu: false,
                    //enableHiding: $scope.permissions.user.write,
                    //visible: $scope.permissions.user.write,
                    headerCellClass: 'headerstyle',
                    cellTemplate: '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.delete(row.entity)"> <i id="delete" class="fa fa-trash-o"></i> </a> </div>'
                }
            ];

        $scope.gridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
        }

        refreshView();
    }

    //Refresh View
    function refreshView() {
        debugger
        svrUser.getUser(function (response) {
            debugger
            response.forEach(function addDates(row, index) {
                //if (row.createdDate != null) {
                //    row.createdDate = new Date(row.createdDate);
                //    row.createdDate = $filter('date')(row.createdDate, 'dd-MM-yyyy hh:mm');
                //}

                //if (row.updatedDate != null) {
                //    row.updatedDate = new Date(row.updatedDate);
                //    row.updatedDate = $filter('date')(row.updatedDate, 'dd-MM-yyyy hh:mm');
                //}

                //if (row.lastLogin != null) {
                //    row.lastLogin = new Date(row.lastLogin);
                //    row.lastLogin = $filter('date')(row.lastLogin, 'dd-MM-yyyy hh:mm');
                //}

                //if (row.lastPasswordChanged != null) {
                //    row.lastPasswordChanged = new Date(row.lastPasswordChanged);
                //    row.lastPasswordChanged = $filter('date')(row.lastPasswordChanged, 'dd-MM-yyyy hh:mm');
                //}
                //if (row.lastLocked != null) {
                //    row.lastLocked = new Date(row.lastLocked);
                //    row.lastLocked = $filter('date')(row.lastLocked, 'dd-MM-yyyy hh:mm');
                //}
                
                if (row.role.length > 0) {
                    var userRole = row.role;
                    userRole = $filter('filter')(userRole, { "isActive": true });
                    row.role = userRole.map(function (elem) {
                            return elem.name; 
                    }).join(" , ");
                }
                
                if (row.emp.length > 0) {
                    var emp = row.emp;
                    emp = $filter('filter')(emp, { "isActive": true });
                    row.empNumber = emp.map(function (elem) {
                        if (elem.isActive == true) {
                            var array = elem.number.split('-');
                            return array[0];
                        }
                    }).join(" , ");
                }
            });
            $scope.gridOptions.data = response;

        });
    }

    $scope.toggleFiltering = function() {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.exporttopdf = function() {
        $scope.gridApi.exporter.pdfExport('all', 'visible');
    };

    $scope.exporttoexcel = function() {
        var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
        $scope.gridApi.exporter.csvExport('all', 'visible', myElement);
    };

    $scope.$on('ngDialog.opened', function(event, $dialog) {
        $dialog.find('.ngdialog-content').css('min-width', '80%').css('background', 'white').css('padding', '0').css('height', '500');
    });
});
