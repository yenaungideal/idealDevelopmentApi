'use strict';

App.controller('ctrlRole', function ($rootScope, $scope, svrRole, uiGridConstants, ngDialog, $filter, $timeout) {
    $scope.isRequired = false;
    $scope.isChanged = false;

    //Add State
    if ($rootScope.roleManagementAddNew == -1) {
        permissionGridOptions();
        getOperations();
    }
    //Edit State
    else {
        $scope.disableModule = true;
        permissionGridOptions();
        svrRole.getRoleByOneRecord($rootScope.roleManagementAddNew, function(data) {
            $scope.roleManagement = data;
            getOperationsInEditState($scope.roleManagement.permission);
        });
    }

    $scope.operation = {};

    $scope.save = function() {
        $scope.isRequired = true;

        if ($scope.roleManagement.name === undefined || $scope.roleManagement.name.length === 0)
            return;

        permission();
        //Save Process
        if ($rootScope.roleManagementAddNew == -1) {
            //$scope.roleManagement.createdBy = $rootScope.currentUser.name;
            $scope.roleManagement.createdBy = "yenaung";
            $scope.roleManagement.isActive = true;

            svrRole.createRoleManagement($scope.roleManagement, function (result) {
                if (result !== undefined && result.statusBool !== false) {
                    alertify.success(result.message);
                    $scope.closeThisDialog();
                } else if (result !== undefined) {
                    if (result.statusHttp == 409) {
                        $scope.customError = result.message;
                    } else {
                        alertify.error(result.message);
                    }
                }
            });
        }
        //Update Process
        else {
            //$scope.roleManagement.updatedBy = $rootScope.currentUser.name;
            $scope.roleManagement.updatedBy = "yenaung";
            svrRole.updateRoleManagement($scope.roleManagement, function (result) {
                if (result !== undefined && result.statusBool !== false) {
                    alertify.success(result.message);
                    $scope.closeThisDialog();
                } else if (result !== undefined) {
                    if (result.statusHttp == 409) {
                        $scope.customError = result.message;
                    } else {
                        alertify.error(result.message);
                    }
                }
            });
        }
    };

    $scope.cancel = function() {
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
                scope: $scope,
                preCloseCallback: function(value) {
                    if (value)
                        $scope.closeThisDialog();
                }
            });
        } else {
            $scope.closeThisDialog();
        }
    };

    function permissionGridOptions() {
        $scope.permissionGridOptions = Object.create($rootScope.gridOptions);
        $scope.permissionGridOptions.enableGridMenu = false,
        $scope.permissionGridOptions.enableFiltering = false;
        $scope.permissionGridOptions.enableSorting = false;

        $scope.permissionGridOptions.columnDefs = [{
                name: 'module',
                enableColumnMenu: false,
                displayName: 'Module',
                width: 180,
                grouping: { groupPriority: 0 },
                cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
            }, {
                name: 'name',
                enableColumnMenu: false,
                displayName: 'Permission',
                minWidth: 150
            },
             {
                 name: 'description',
                 enableColumnMenu: false,
                 displayName: 'Description',
                 minWidth: 250
             }, {
                name: 'read',
                enableColumnMenu: false,
                enableFiltering: false,
                field: 'read',
                width: 80,
                headerCellClass: 'headerstyle',
                headerCellTemplate: '<div class="headerRead">Read <input type="checkbox" ng-model="col.value"  ng-click="grid.appScope.onSelectAll(col)"></input></div>',
                cellTemplate: '<div class="ui-grid-hcenter"><input type="checkbox"  ng-hide="row.entity.name===undefined" ng-model="row.entity.read" ng-click="$event.stopPropagation();getExternalScopes(row.entity);grid.appScope.onReadValueChanged(row.entity)"></div>'
            },

            {
                name: 'write',
                enableColumnMenu: false,
                enableFiltering: false,
                field: 'write',
                width: 80,
                headerCellClass: 'headerstyle',
                cellTemplate: '<div class="ui-grid-hcenter"><input type="checkbox"   ng-hide="row.entity.name===undefined" ng-model="row.entity.write" ng-click="$event.stopPropagation();getExternalScopes();grid.appScope.onValueChanged(row.entity)"></div>'
            }
        ];

        $scope.permissionGridOptions.appScopeProvider = {
            onValueChanged: function (row) {
                if (row.write) {
                    row.read = false;
                    row.write = false;
                } else {
                    row.read = true;
                    row.write = true;
                   
                }
            },
            onReadValueChanged: function (row) {
                if (!row.read) {
                    row.write = false;
                }
            },
            onSelectAll: function (col) {
                var gridColumnValues = col.grid.rows;
                gridColumnValues.forEach(function (row, index) {
                    if (col.value == undefined || col.value == false) {
                        row.entity.read = true;
                    } else {
                        if (row.entity.write) {
                            row.entity.write = false;
                        }
                        row.entity.read = false;
                    }
                });
            }
        };

        $scope.permissionGridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;

            $scope.gridApi.grid.registerDataChangeCallback(function () {
                $timeout($scope.gridApi.treeBase.expandAllRows);
                //$scope.gridApi.treeBase.expandAllRows();
            });
        }
    }

    function getOperations() {
        svrRole.getOperations(function (response) {
            response.forEach(function responseData(row, index) {
                row.create = false;
                row.read = false;
                row.write = false;
            });
            $scope.permissionGridOptions.data = response;
        });
    }

    function getOperationsInEditState(data) {
        svrRole.getOperations(function (response) {
            response.forEach(function responseData(row, index) {
                var obj = returnJSON(data, row._id);
                if (obj !== undefined) {
                    row.read = obj.read;
                    row.write = obj.write;
                } else {
                    row.read = false;
                    row.write = false;
                }

            });
            $scope.permissionGridOptions.data = response;
        });
    }

    $scope.selectAll = function() {
        selectAll($scope.selectAllChecked);
    }

    function selectAll(status) {
        if ($rootScope.roleManagementAddNew == -1) {
            svrRole.getOperations(function (response) {
                response.forEach(function responseData(row, index) {
                    if (status === true) {
                        row.read = true;
                        row.write = true;
                    } else {
                        row.read = false;
                        row.write = false;
                    }

                });
                $scope.permissionGridOptions.data = response;
            });
        } else {
            svrRole.getRoleByOneRecord($rootScope.roleManagementAddNew, function (data) {
                getOperationsInEditState_DeselecteAll(data.permission, status);
            });
        }
    }

    function getOperationsInEditState_DeselecteAll(data, status) {
        svrRole.getOperations(function (response) {
            response.forEach(function responseData(row, index) {
                var obj = returnJSON(data, row._id);
                if (obj !== undefined && status == true) {
                    row.read = true;
                    row.write = true;
                } else {
                    row.read = false;
                    row.write = false;
                }

            });
            $scope.permissionGridOptions.data = response;
        });
    }

    function returnJSON(data, id) {
        var object = {};
        jQuery.map(data, function(obj) {
            if (obj.ref === id)
                object = obj;
        });
        return object;
    }

    function permission() {
        var permissionArray = [];
        var array = $scope.permissionGridOptions.data;
        for (var i = 0; i < array.length; i++) {
            permissionArray.push({ "ref": array[i]._id, "module": array[i].module, "name": array[i].name, "read": array[i].read, "write": array[i].write, "isActive": true });
        }
        $scope.roleManagement.permission = permissionArray;
    }

    //control for Permission ui-grid
    $scope.toggleFiltering = function () {
        $scope.permissionGridOptions.enableFiltering = !$scope.permissionGridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.expandAll = function () {
        $scope.$timeout($scope.gridApi.treeBase.expandAllRows());
    };

    $scope.collapseAll = function () {
        $scope.gridApi.treeBase.collapseAllRows();
    }

    $scope.$on('ngDialog.opened', function(event, $dialog) {
        $dialog.find('.ngdialog-content').css('min-width', '80%').css('background', 'white').css('padding', '0').css('height', '225');
    });

});
