'use strict';
App.controller('ctrlPermissionView', function($rootScope, $scope,  $filter,uiGridConstants,ngDialog,svrPermission) {

    //Permissions according to user 
    // $scope.permissions = svrUserPermission.getUserPermissions().userManagement;
    debugger
    //Delete
    // $scope.delete = function(userManagement) {
    //     $scope.confirm = {
    //         title: "Confirm",
    //         message: "Are you sure to delete a record ?"
    //     }

    //     ngDialog.open({
    //         template: 'app/pages/general/confirmation/confirmation.html',
    //         className: 'ngdialog-theme-default confirmDialog',
    //         closeByDocument: false,
    //         closeByEscape: false,
    //         showClose: false,
    //         scope: $scope,
    //         preCloseCallback: function(value) {
    //             if (value) {
    //                 userManagement.isActive = false;
    //                 userManagement.updatedBy = $rootScope.currentUser.name;
    //                 svrUserManagement.updateUserManagement(userManagement, function(result) {
    //                     if (result !== undefined && result.statusBool !== false) {
    //                         alertify.success(result.message);
    //                         refreshView();
    //                     } else if (result !== undefined) {
    //                         alertify.error(result.message);
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // }

    //Edit
    $scope.edit = function(permission) {
        debugger
        if (permission === undefined) {
            $rootScope.permissionAddNew = -1;
        } else {
            $rootScope.permissionAddNew = permission._id;
        }

        var ngDialogInstance = ngDialog.open({
            template: 'app/pages/userManagement/permission/permission.edit.html',
            className: 'ngdialog-theme-default',
            closeByDocument: false,
            closeByEscape: true,
            showClose: false ,
            //trapFocus: false,
            preCloseCallback: function () {
                $rootScope.permissionAddNew = undefined;
                refreshPermission();
            }
        });
    };

    gridOptions();
    function gridOptions() {

        $scope.gridOptions = Object.create($rootScope.gridOptions);
        $scope.gridOptions.exporterCsvFilename = 'Permission.csv';
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableSorting = true;
        $scope.gridOptions.enableColumnResizing = true;
        $scope.gridOptions.exporterPdfHeader.text = "Permission";
        $scope.gridOptions.columnDefs = [
            /*{
                name: 'Edit', enableSorting: false, width: 55, enableFiltering: false, enableColumnMenu: false,
                headerCellClass: 'headerstyle',
                cellTemplate:
               '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.edit(row.entity)" ng-hide="row.entity.name===undefined"><i id="edit" class="fa fa-pencil-square-o" ></i> </a> </div>'
            },*/
            {
                name: 'module', enableColumnMenu: false, width: 200,
                displayName: 'Module',
                grouping: { groupPriority: 1 },
                cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
            },
            {
                name: 'name', enableColumnMenu: false, enableSorting: false,
                displayName: 'Name', width: 300

            },
            {
                name: 'description', enableColumnMenu: false, enableSorting: false,
                displayName: 'Description',minWidth:300
            },
            {
                name: 'createdBy', minWidth: 150, visible: false,
                displayName: 'Created By', enableColumnMenu: false
            },
            {
                name: 'createdDate', enableColumnMenu: false, enableSorting: false, cellFilter: 'date:\'dd-MM-yyyy hh:mm\'',
                displayName: 'Created Date', width: 150
            },
            {
                name: 'updatedBy', minWidth: 150, visible: false,
                displayName: 'Updated By', enableColumnMenu: false
            },
            {
                name: 'updatedDate', minWidth: 150, visible: false, cellFilter: 'date:\'dd-MM-yyyy hh:mm\'',
                displayName: 'Updated Date', enableColumnMenu: false
            },
           /* {
                name: 'Delete', enableSorting: false, width: 70, enableFiltering: false, enableColumnMenu: false,
                headerCellClass: 'headerstyle',
                cellTemplate:
                     '<div class="ui-grid-hcenter"> <a href="javascript:void[0]" ng-click="grid.appScope.delete(row.entity)" ng-hide="row.entity.name===undefined"> <i id="delete" class="fa fa-trash-o" ></i> </a> </div>'
            }*/
        ];
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.handleWindowResize();
        }
        refreshPermission();
    }

    function refreshPermission() {
        $scope.gridOptions.data = undefined;
        svrPermission.getPermissions(function (response) {
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
