App.controller('ctrlLogin', function ($scope, $routeParams, svrAuth, svrUser, $rootScope, $state, $location, svrUserPermission) {
    //svrAuth
    $scope.isRequired = false;
    var logoutStatus = $location.search().state;
    if (logoutStatus !== undefined) {
        if ($rootScope.currentUser !== undefined) {
            if ($rootScope.currentUser.name !== undefined) {
                svrAuth.createLogoutHistory({ "userName": $rootScope.currentUser.name }, processResponse)
                function processResponse(res) {
                    if (res.statusBool) {
                        clearData();
                    } else {
                        $scope.authVal = res.message;
                    }
                }
            }
            else {
                clearData();
            }
        }
    }
    //svrAuth.logout();
    $rootScope.showNav = false;

    $scope.login = function () {
        if ($scope.userName === undefined || $scope.userName === null || $scope.userName.length === 0) {
            $scope.userNameVal = "Username is required";
            $scope.isRequired = true;
        } else {
            $scope.userNameVal = "";
        }

        if ($scope.password === undefined || $scope.password === null || $scope.password.length === 0) {
            $scope.passwordVal = "Password is required";
            $scope.isRequired = true;
            return;
        } else {
            $scope.passwordVal = "";
        }

        svrAuth.authenticate($scope.userName, $scope.password, processResponse)

        function processResponse(res) {
            debugger
            if (res.statusBool) {

                $rootScope.currentUser = res.data;
                svrUserPermission.rebind();
                if (res.data.forcePasswordChange) {
                    window.location = "/#/changePassword";
                    return;
                }
                $rootScope.showNav = true;
                $state.go('index');
            } else {
                $scope.authVal = res.message;
            }
        }
    }


    function clearData() {
        $scope.userName = undefined;
        $scope.password = undefined;
        $rootScope.currentUser = undefined;
        logoutStatus = undefined;
    }
});
