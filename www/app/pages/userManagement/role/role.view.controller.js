'use strict';

App.controller('ctrlRoleView', function ($rootScope, $scope, svrRole, svrUser, uiGridConstants, ngDialog, $filter) {

    //Delete
    $scope.delete = function (roleManagement) {
        $scope.confirm = {
            title: "Confirm",
            message: "Are you sure to delete a record ?"
        }
       
        ngDialog.open({
            template: 'app/pages/general/confirmation/confirmation.html',
            className: 'ngdialog-theme-default confirmDialog',
            closeByDocument: false,
            closeByEscape: true,
            showClose: false,
            scope: $scope,
            preCloseCallback: function (value) {
                if (value == true) {
                    roleManagement.isActive = false;
                    //roleManagement.updatedBy = $rootScope.currentUser.name;
                    roleManagement.updatedBy = "yenaung";
                     isValidtoDelete(roleManagement);
                }
            }
        });
    };

    function isValidtoDelete(roleManagement) {
         svrUser.getUser(function (response) {
             debugger
             var obj = returnStatusToDelete(response, roleManagement._id);
             if (obj.status === false) {
                 svrRole.updateRoleManagement(roleManagement, function (result) {
                     if (result !== undefined && result.statusBool !== false) {
                         alertify.success(result.message);
                         refreshView();
                     }
                     else if (result !== undefined) {
                         alertify.error(result.message);
                     }
                 });
                 //$scope.closeThisDialog();
             }
             else {
            
                 $scope.confirm = {
                     title: "Confirm",
                     message: "Role is mapped to User. Do you want to delete ?"
                 }

                 ngDialog.open({
                     template: 'app/pages/general/confirmation/confirmation.html',
                     className: 'ngdialog-theme-default confirmDialog',
                     closeByDocument: false,
                     closeByEscape: true,
                     showClose: false,
                     scope: $scope,
                     preCloseCallback: function (value) {
                         if (value == true) {
                             svrRole.deleteUserRole(obj, function (result) {
                                 if (result !== undefined && result.statusBool !== false) {
                                     svrRole.updateRoleManagement(roleManagement, function (result) {
                                         if (result !== undefined && result.statusBool !== false) {
                                             alertify.success(result.message);
                                             refreshView();
                                             $scope.closeThisDialog();
                                         }
                                         else if (result !== undefined) {
                                             alertify.error(result.message);
                                             $scope.closeThisDialog();
                                         }
                                     });
                                 }
                                 else if (result !== undefined) {
                                     alertify.error(result.message);
                                     $scope.closeThisDialog();
                                 }
                             });
                         }
                     }
                 });
             }
         });
     }

    function returnStatusToDelete(data, id) {
         var status = false;
         var obj = {};
         obj.user = [];
         for (var i = 0; i < data.length; i++) {
             var tmp = data[i].role;
             var object = {};
             jQuery.map(tmp, function (obj) {
                 if (obj._id === id)
                     object = obj;
             });
             if (object._id !== undefined) {
                 status = true;
                 obj.user.push(data[i]._id);
             }
         }
         obj.roleId = id;
         obj.status = status;
         return obj;
     }

    //ModalDialog
    $scope.edit = function (roleManagement) {
        if (roleManagement === undefined) {
            $rootScope.roleManagementAddNew = -1;
        } else {
            $rootScope.roleManagementAddNew = roleManagement._id;
        }
        var ngDialogInstance = ngDialog.open({
            template: 'app/pages/userManagement/role/role.edit.html',
            className: 'ngdialog-theme-default',
            closeByDocument: false,
            closeByEscape: true,
            showClose: false,
            preCloseCallback: function () {
                $rootScope.roleManagementAddNew = undefined;
                refreshView();
            }
        });
    };

    gridOptions();
    function gridOptions() {
        $scope.gridOptions = Object.create($rootScope.gridOptions);
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableSorting = true;
        $scope.gridOptions.enableColumnResizing = true;
        $scope.gridOptions.exporterCsvFilename = 'Role.csv';
        $scope.gridOptions.exporterPdfHeader.text = "Role";
        $scope.gridOptions.columnDefs = [
            {
                name: 'Edit', enableSorting: false, width: 55, enableFiltering: false, enableColumnMenu: false,
                headerCellClass: 'headerstyle',
                cellTemplate:
               '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.edit(row.entity)"><i id="edit" class="fa fa-pencil-square-o"></i> </a> </div>'
            },
            {
                name: 'name', enableColumnMenu: false,
                displayName: 'Name', width: 500
            },
            {
                name: 'description', enableColumnMenu: false,
                displayName: 'Description', minWidth: 250

            },
            {
                name: 'createdBy', minWidth: 150, visible: false,
                displayName: 'Created By', enableColumnMenu: false
            }, 
            {
                name: 'createdDate', enableColumnMenu: false,
                displayName: 'Created Date', width: 200
            }, 
            {
                name: 'updatedBy', minWidth: 150, visible: false,
                displayName: 'Updated By', enableColumnMenu: false
            },
            {
                name: 'updatedDate', minWidth: 150, visible: false,
                displayName: 'Updated Date', enableColumnMenu: false
            },
            {
                name: 'Delete', enableSorting: false, width: 70, enableFiltering: false, enableColumnMenu: false,
                headerCellClass: 'headerstyle',
                cellTemplate:
                '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.delete(row.entity)"> <i class="fa fa-trash-o" style="font-size:1.5em;color:red"></i> </a> </div>'
            }

        ];

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        }
        refreshView();
    }

    //Refresh View
    function refreshView() {
        svrRole.getRole(function (response) {
            debugger
            response.forEach(function addDates(row, index) {
                if (row.createdDate != null) {
                    row.createdDate = new Date(row.createdDate);
                    row.createdDate = $filter('date')(row.createdDate, 'dd-MM-yyyy hh:mm');
                }

                if (row.updatedDate != null) {
                    row.updatedDate = new Date(row.updatedDate);
                    row.updatedDate = $filter('date')(row.updatedDate, 'dd-MM-yyyy hh:mm');
                }
            });
            $scope.gridOptions.data = response;
        });
    }

    $scope.toggleFiltering = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.exporttopdf = function () {
        $scope.gridApi.exporter.pdfExport('all', 'visible');
    };

    $scope.exporttoexcel = function () {
        var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
        $scope.gridApi.exporter.csvExport('all', 'visible', myElement);
    };

    $scope.$on('ngDialog.opened', function (event, $dialog) {
        $dialog.find('.ngdialog-content').css('min-width', '55%').css('background', 'white').css('padding', '0').css('height', '225');
    });

});




























