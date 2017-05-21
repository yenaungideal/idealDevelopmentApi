'use strict';

App.controller('ctrlUserManagement', function ($rootScope, $scope, ngDialog, uiGridConstants, $filter, $location, $timeout, svrUser, svrRole) {

    $scope.isRequired = false;
    $scope.isChanged = false;
    $scope.showPanel = true;
    $scope.userManagement = {};

    //For My Profile
    //var myProfile = $location.search().state;
    var myProfile = undefined;
    if (myProfile !== undefined) {
        $scope.hideUserManagement = true;
        $scope.hidePanel = true;
        svrUser.getEmployeeRecordByName($rootScope.currentUser.name, function (data) {
            var lastLoginDate = new Date(data.lastLogin);
            lastLoginDate = $filter('date')(lastLoginDate, 'dd-MM-yyyy hh:mm');

            var lastPasswordChangedDate = new Date(data.lastPasswordChanged);
            lastPasswordChangedDate = $filter('date')(lastPasswordChangedDate, 'dd-MM-yyyy hh:mm');

            $scope.userManagement = data;
            if (data.isLocked === true) {
                $scope.userManagement.isLockedStatus = "Locked";
            }
            else {
                $scope.userManagement.isLockedStatus = "UnLocked";
            }

            $scope.userManagement.lastLoginStatus = lastLoginDate;
            $scope.userManagement.lastPasswordChangedStatus = lastPasswordChangedDate;

            if ($scope.userManagement.emp !== "" || $scope.userManagement.emp !== undefined) {
                var employeeName = "";
                if ($scope.userManagement.emp.length > 0) {
                    var emp = $filter('filter')($scope.userManagement.emp, { isActive: true });
                    employeeName = emp.map(function (elem) {
                        return elem.number;
                    }).join(" , ");
                    $scope.userManagement.empName = employeeName;
                }
            }

            if ($scope.userManagement.role !== "" || $scope.userManagement.role !== undefined) {
                var role = "";
                if ($scope.userManagement.role.length > 0) {
                    var userRole = $filter('filter')($scope.userManagement.role, { isActive: true });
                    role = userRole.map(function (elem) {
                        return elem.name;
                    }).join(" , ");
                }

                $scope.userManagement.role = role;
            }

            getCompanyForMyProfile($scope.userManagement.company);
        });
    }
        //Add State
    else if ($rootScope.userManagementAddNew == -1) {
        $scope.steps = ['Basic Info', 'Company & Department'];
        $scope.selection = $scope.steps[0];
        getEmployee();
        getRole();
        gridOptions();
        getCompanyForGridUI();
        $scope.hideMyProfile = true;
    }
        //Edit State
    else {
        $scope.steps = ['Basic Info', 'Company & Department'];
        $scope.selection = $scope.steps[0];
        getRole();
        gridOptions();
        getCompanyForGridUI();
        $scope.hideMyProfile = true;
        $scope.hideModuleEditState = true;
        $scope.disableModule = true;
        svrUser.getEmployeeByOneRecord($rootScope.userManagementAddNew, function (data) {
            var lastLoginDate = new Date(data.lastLogin);
            lastLoginDate = $filter('date')(lastLoginDate, 'dd-MM-yyyy hh:mm');

            var lastPasswordChangedDate = new Date(data.lastPasswordChanged);
            lastPasswordChangedDate = $filter('date')(lastPasswordChangedDate, 'dd-MM-yyyy hh:mm');

            $scope.userManagement = data;
            $scope.userManagement.lastLoginStatus = lastLoginDate;
            $scope.userManagement.lastPasswordChangedStatus = lastPasswordChangedDate;

            if (data.emp !== undefined) {
                getEmployeeInEditState(data.emp);
            }
            else {
                getEmployee();
            }

            var tempRole;
            if ($scope.userManagement.role !== "" || $scope.userManagement.role !== undefined) {
                tempRole = $scope.userManagement.role;
                var array = $filter('filter')($scope.userManagement.role, { isActive: true });
                var roleArray = array;
                var roletemp = [];
                for (var i = 0; i < roleArray.length; i++) {
                    if (roleArray[i].isActive === true) {
                        roletemp.push({ "id": roleArray[i].ref, "name": roleArray[i].name });
                    }

                }
                $scope.userManagement.role = roletemp;
            }

            //take created Role
            if (tempRole !== "" || tempRole !== undefined) {

                var roleArray = tempRole;
                var roletemp = [];
                for (var i = 0; i < roleArray.length; i++) {
                    roletemp.push({ "id": roleArray[i].ref, "name": roleArray[i].name, "isActive": roleArray[i].isActive });
                }
                $scope.tmpRole = roletemp;
            }

            var tempEmp;
            //Employee Data Bind And Indexing in Edit Mode

            if ($scope.userManagement.emp !== "" || $scope.userManagement.emp !== undefined) {
                tempEmp = $scope.userManagement.emp;
                var array = $filter('filter')($scope.userManagement.emp, { isActive: true });
                var employeeArray = array;
                var employeetemp = [];
                for (var i = 0; i < employeeArray.length; i++) {
                    var obj = {};
                    obj.id = employeeArray[i].ref;
                    obj.name = employeeArray[i].number;
                    employeetemp.push(obj);
                }
                $scope.userManagement.emp = employeetemp;
            }

            //take created Employee
            if (tempEmp !== "" || tempEmp !== undefined) {
                var employeeArray = tempEmp;
                var employeetemp = [];
                for (var i = 0; i < employeeArray.length; i++) {
                    var obj = {};
                    obj.id = employeeArray[i].ref;
                    obj.name = employeeArray[i].number;
                    obj.isActive = employeeArray[i].isActive
                    employeetemp.push(obj);
                }
                $scope.tmpEmp = employeetemp;
            }

            $scope.company = $scope.userManagement.company;
            $scope.tmpCompany = $scope.userManagement.company;

            //getCompanyInEditStateForGridUi($scope.userManagement.company);
        });
    }

    function getCompanyForGridUI() {
        svrUser.getCompanyForGridUI(function (response) {
            refreshCompanyForGridUI(response);
        });
    }

    $scope.employeeData = []
    function getEmployee() {
        var obj = {};
        svrUser.getEmployee(obj, function (data) {
            var tmpArray = [];
            var tmpArray2 = [];
            data.empArray.forEach(function (row, index) {
                tmpArray.push({ "id": row.id, "name": row.name });
                if (row.designation !== undefined) {
                    tmpArray2.push({ "id": row.id, "name": row.name, "designation": row.designation });
                } else {
                    tmpArray2.push({ "id": row.id, "name": row.name });
                }
            })
            $scope.employeeData = tmpArray;
            $scope.tempEmployeeData = tmpArray2;
        });
    }

    $scope.roleData = [];
    function getRole() {
        svrUser.getRole(function (data) {
            $scope.roleData = $filter('orderBy')(data.role, 'name');
        });
    }

    function getCompanyInEditStateForGridUi(company) {
        svrUser.getCompanyForGridUI(function (response) {
            $scope.gridOptions.data = response;
            if (company !== undefined && company.length > 0) {
                var array = [];
                var obj;
                company.forEach(function prepareData(row, index) {
                    var dep = row.department;
                    dep.forEach(function prepareData(depRow, index) {
                        if (depRow.isActive === true) {
                            obj = { "companyId": row.ref, "departmentId": depRow.ref };
                            array.push(obj);
                        }
                    });
                });
                $timeout(function () {
                    for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                        var depId = $scope.gridOptions.data[i].departmentId;
                        var status = array.filter(function (obj) {
                            return obj.departmentId == depId;
                        });
                        if (status.length > 0) {
                            $scope.gridApiCmp.selection.selectRow($scope.gridOptions.data[i]);
                        }
                    }
                }, 100);
            }
        });
    };

    function getCompanyForMyProfile(company) {
        svrUser.getCompanyForGridUI(function (response) {
            if (company.length > 0) {
                var array = [];
                var obj;
                company.forEach(function prepareData(row, index) {
                    var dep = row.department;
                    dep.forEach(function prepareData(depRow, index) {
                        if (depRow.isActive === true) {
                            obj = { "companyId": row.ref, "departmentId": depRow.ref };
                            array.push(obj);
                        }
                    });
                });
            }
            $timeout(function () {
                var tmparr = [];
                var tmpCmp = [];
                for (var i = 0; i < array.length; i++) {
                    var depId = array[i].departmentId;
                    var status = response.filter(function (obj) {
                        return obj.departmentId == depId;
                    });

                    if (status.length > 0) {
                        tmparr.push(status[0]);
                        tmpCmp.push({ "companyId": status[0].companyId, "companyName": status[0].companyName });
                    }
                }

                var company = arrUnique(tmpCmp);
                var arryData = [];
                company.forEach(function prepareData(row, index) {
                    var obj = {};
                    obj.companyName = row.companyName;
                    var dep = [];
                    var cmpId = row.companyId;
                    tmparr.forEach(function prepareDataDep(row, index) {
                        if (row.companyId == cmpId) {
                            dep.push({ "departmentName": row.departmentName });
                        }
                    });
                    obj.departmentName = dep;

                    arryData.push(obj);
                });
                $scope.companyAndDepartmentList = arryData;

            }, 100);

        });
    };

    function getEmployeeInEditState(empData) {
        var tmpArray = [];
        var tmpArray2 = [];
        var array = $filter('filter')(empData, { isActive: true });

        svrUser.getEmployeeDataInEditState(array, function (data) {
            data.empArray.forEach(function (row, index) {
                tmpArray.push({ "id": row.id, "name": row.name });
                if (row.designation !== undefined) {
                    tmpArray2.push({ "id": row.id, "name": row.name, "designation": row.designation });
                } else {
                    tmpArray2.push({ "id": row.id, "name": row.name });
                }
            })

            $scope.employeeData = tmpArray;
            $scope.tempEmployeeData = tmpArray2;
        });
    }

    function refreshCompanyForGridUI(data) {
        $scope.gridOptions.data = data;
    }

    $scope.save = function (pageState) {
        $scope.isRequired = true;

        if ($scope.userManagement.name === undefined || $scope.userManagement.name.length === 0)
            return;

        if ($scope.userManagement.email === undefined || $scope.userManagement.email.length === 0)
            return;

        if ($scope.userManagement.role === undefined || $scope.userManagement.role.length === 0)
            return;

        saveUpdate();
    }

    function saveUpdate(attachedDetails) {
        
        if ($scope.gridApiCmp !== undefined) {
            if ($scope.gridApiCmp.selection !== undefined) {
                var organization = $scope.gridApiCmp.selection.getSelectedRows();
                companyForGridUi(organization);
            }
        }

        $scope.saveUserManagement = angular.copy($scope.userManagement);
        convertEmployeeArrayObject();
        convertRoleArrayObject();

        //Save Process
        if ($rootScope.userManagementAddNew == -1) {
            //$scope.saveUserManagement.createdBy = $rootScope.currentUser.name;
            $scope.saveUserManagement.createdBy ="yenaung";
            svrUser.createUserManagement($scope.saveUserManagement, function (result) {
                if (result !== undefined && result.statusBool !== false) {
                    alertify.success(result.message);
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
        //Update Process
        else {
            //$scope.saveUserManagement.updatedBy = $rootScope.currentUser.name;
            $scope.saveUserManagement.updatedBy ="yenaung";
            svrUser.updateUserManagement($scope.saveUserManagement, function (result) {
                if (result !== undefined && result.statusBool !== false) {
                    alertify.success(result.message);
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
    }

    //remove duplicate object
    function arrUnique(arr) {
        var cleaned = [];
        arr.forEach(function (itm) {
            var unique = true;
            cleaned.forEach(function (itm2) {
                if (_.isEqual(itm.companyId, itm2.companyId)) unique = false;
            });
            if (unique) cleaned.push(itm);
        });
        return cleaned;
    }

    function companyForGridUi(organization) {
        var tmpOrganization = arrUnique(organization);
        var company = [];
        for (var i = 0; i < tmpOrganization.length; i++) {
            var obj = {};
            var cmpId = tmpOrganization[i].companyId;
            obj.ref = cmpId;
            obj.isActive = true;
            var department = [];

            var tempDep = organization.filter(function (obj) {
                return obj.companyId == cmpId;
            });

            for (var j = 0; j < tempDep.length; j++) {
                department.push({ "ref": tempDep[j].departmentId, "isActive": true });
            }
            obj.department = department;
            company.push(obj);
        }

        $scope.userManagement.company = company;
    }

    function convertEmployeeArrayObject() {
        if ($scope.userManagement.emp !== undefined) {
            var employeeArray = $scope.userManagement.emp;
            var array = [];
            for (var i = 0; i < employeeArray.length; i++) {
                array.push({ "ref": employeeArray[i].id, "number": employeeArray[i].name });
            }
            $scope.saveUserManagement.emp = array;
        }
    }

    function convertRoleArrayObject() {
        if ($scope.userManagement.role !== undefined) {
            var roleArray = $scope.userManagement.role;
            var array = [];
            for (var i = 0; i < roleArray.length; i++) {
                array.push({ "ref": roleArray[i].id, "name": roleArray[i].name });
            }
            $scope.saveUserManagement.role = array;
        }
    }

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
                scope: $scope,
                preCloseCallback: function (value) {
                    if (value == true) {
                        $scope.closeThisDialog();
                    }
                }
            });
        }
        else {
            $scope.closeThisDialog();
        }
    }

    function EnableDisableControl() {
        $scope.hideControl = false;
    }

    $scope.limitEmploreeSearch = 75; //Init with no limit : to see a previous selected valued in database (edit mode)

    $scope.CheckEmployee = function (EmployeeTyped) {
        if (EmployeeTyped.length >= 1) {
            $scope.limitEmploreeSearch = 75;
        } else {
            $scope.limitEmploreeSearch = 75;
        }
    }

    $scope.$on('ngDialog.opened', function (event, $dialog) {
        $dialog.find('.ngdialog-content').css('min-width', '75%').css('background', 'white').css('padding', '0').css('height', '225');
    });

    function gridOptions() {
        $scope.gridOptions = Object.create($rootScope.gridOptions);
        $scope.gridOptions.enableGridMenu = false,
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableSorting = false;
        $scope.gridOptions.enableGroupHeaderSelection = true;
        $scope.gridOptions.enableRowSelection = true
        $scope.gridOptions.multiSelect = true;

        $scope.gridOptions.columnDefs = [{
            name: 'companyName',
            enableColumnMenu: false,
            displayName: 'Company',
            width: 320,
            grouping: { groupPriority: 0 },
            cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
        }, {
            name: 'departmentName',
            enableColumnMenu: false,
            displayName: 'Department',
            minWidth: 300
        }

        ];

        $scope.gridOptions.onRegisterApi = function (gridApi) {

            $scope.gridApiCmp = gridApi;

            //Select child row by grouping field
            $scope.gridApiCmp.selection.on.rowSelectionChanged($scope, function (row) {

                if (row.internalRow == true && row.isSelected == true) {
                    var childRows = row.treeNode.children;
                    for (var j = 0, length = childRows.length; j < length; j++) {
                        var rowEntity = childRows[j].row.entity;
                        $scope.gridApiCmp.selection.selectRow(rowEntity);
                    }
                }

                if (row.internalRow == true && row.isSelected == false) {

                    var childRows = row.treeNode.children;
                    for (var j = 0, length = childRows.length; j < length; j++) {
                        var rowEntity = childRows[j].row.entity;
                        $scope.gridApiCmp.selection.unSelectRow(rowEntity);
                    }
                }

            });

            $scope.gridApiCmp.grid.registerDataChangeCallback(function () {
                $scope.gridApiCmp.treeBase.expandAllRows();
            });
        }
    }

    $scope.selectAll = function () {
        selectAll($scope.userManagement.selectAllChecked);
    }

    function selectAll(status) {
        var gridColumnValues = $scope.gridApiPermission.grid.rows;
        gridColumnValues.forEach(function (row, index) {
            if (status) {
                row.entity.read = true;
                row.entity.write = true;
            } else {
                row.entity.read = false;
                row.entity.write = false;
            }
        });
    }

    //control for Company & Department ui-grid
    $scope.toggleFilteringCompany = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApiCmp.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.expandAllCompany = function () {
        $scope.gridApiCmp.treeBase.expandAllRows();
    };

    $scope.collapseAllCompany = function () {
        $scope.gridApiCmp.treeBase.collapseAllRows();
    }

    $scope.getCurrentStepIndex = function () {
        // Get the index of the current step given selection
        return _.indexOf($scope.steps, $scope.selection);
    };

    $scope.hasPreviousStep = function () {
        var stepIndex = $scope.getCurrentStepIndex();
        var previousStep = stepIndex - 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[previousStep]);
    };

    // Go to a defined step index
    $scope.goToStep = function (index) {

        $scope.isRequired = true;
        if ($scope.userManagement.name === undefined || $scope.userManagement.name.length === 0)
            return;

        if ($scope.userManagement.email === undefined || $scope.userManagement.email.length === 0)
            return;

        if ($scope.userManagement.role === undefined || $scope.userManagement.role.length === 0)
            return;

        var stepIndex = $scope.getCurrentStepIndex();

        //carry current selected company&department data
        if (stepIndex == 1) {
            var organization = $scope.gridApiCmp.selection.getSelectedRows();
            companyForGridUi(organization);
            $scope.company = $scope.userManagement.company;
        } else {
            getCompanyInEditStateForGridUi($scope.company);
        }

        var nextStep = index;

        //var nextStep = stepIndex + 1;
        $scope.selection = $scope.steps[nextStep];
        $scope.hideModule = true;


        if (!_.isUndefined($scope.steps[index])) {
            $scope.selection = $scope.steps[index];
        }

        if (nextStep == 2) {
            preparePermissionByRole();
        }
    };

});




























