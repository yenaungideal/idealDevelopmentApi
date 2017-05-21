'use strict';

App.controller('ctrlSidebar', function ($rootScope, $scope) {
    $scope.menuItems = [];
    debugger
      var array = [];

        var obj = {};
        obj.heading = true;
        obj.href = "#";
        obj.icon = "fa fa-tachometer fa-fw";
        obj.submenu = [{
            href: "/#/dashboard",
            icon:"fa fa-tachometer fa-fw",
            module:"general",
            permission:"dashboard",
            text:"General"
        }];
        obj.text="Dashboard"
        array.push(obj);


      $scope.menuItems = array;
});