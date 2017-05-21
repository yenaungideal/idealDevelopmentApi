'use strict';

App.controller('ctrlLogHistory', function ($rootScope, $scope, uiGridConstants, svrAuth, $filter) {
    $scope.issuanceHistory = {};
    $scope.isRequired = false;

    gridOptions();

    function gridOptions() {
        $scope.gridOptions = Object.create($rootScope.gridOptions);
        $scope.gridOptions.enableFiltering = false;
        $scope.gridOptions.enableSorting = true;
        $scope.gridOptions.enableColumnResizing = true;

        $scope.gridOptions.columnDefs = [
            {
                name: 'name', enableColumnMenu: false,
                displayName: 'Login Name', width: 140
            },
             {
                 name: 'attemptTime', enableColumnMenu: false,
                 displayName: 'Attempt Time', width: 140
             },
            {
                name: 'attemptStatus', enableColumnMenu: false,
                displayName: 'Status', width: 150
            },
            {
                name: 'attemptResult', enableColumnMenu: false,
                displayName: 'Result', width: 150
            },
            {
                name: 'attemptDescription', enableColumnMenu: false,
                displayName: 'Description'
            },
            {
                name: 'attemptCount', enableColumnMenu: false,
                displayName: 'Attempt Count', width: 150
            }
            
        ];

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        }
    }

    $scope.refreshView = function () {
        refreshView();
    }

    function refreshView() {
        var fromDate;
        if ($scope.fromDate !== undefined && $scope.fromDate !== "") {
            fromDate = $scope.fromDate;
        }
        else if ($scope.fromDate !== undefined) {
            if ($scope.fromDate !== "") {
                fromDate = $scope.fromDate;
            }
        }
        else if ($scope.fromDate == "") {
            fromDate = undefined;
        }

        var toDate;
        if ($scope.toDate !== undefined && $scope.toDate !== "") {
            toDate = $scope.toDate;
        }
        else if ($scope.toDate !== undefined) {
            if ($scope.toDate !== "") {
                toDate = $scope.toDate;
            }
        }
        else if ($scope.toDate == "") {
            toDate = undefined;
        }

        var obj = { "fromDate": fromDate, "toDate": toDate };
        debugger
        svrAuth.getLogHistory(obj, function (response) {
            debugger
            response.forEach(function prepareDate(row, index) {
                if (row.attemptTime !== null) {
                    row.attemptTime = new Date(row.attemptTime);
                    row.attemptTime = $filter('date')(row.attemptTime, 'dd-MMM-yyyy hh:mm:ss');
                }
            });
            $scope.gridOptions.data = response;
        });
    }
});


