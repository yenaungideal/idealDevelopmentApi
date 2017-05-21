'use strict';
App.directive('menuDirective', function($compile) {

    return {
        template: '',
        replace: true,
        link: function($scope, element) {
            var menuItem = $scope.menuItem;
            var html = getMenuItems(menuItem);
            var el = angular.element(html);
            $compile(el)($scope);
            element.append(el);
        }
    };


    function getMenuItems(menuItem) {
        var html = '';
        if (menuItem.submenu !== undefined && menuItem.submenu.length > 0) {
            html = '<a href="javascript:;" data-toggle="dropdown" class="dropdown-toggle"><i class="' + menuItem.icon + ' cus-nav-icon"></i>&nbsp;' + menuItem.text + ' &nbsp;<i class="fa fa-angle-down"></i></a>';
            html = html + getSubMenuItems(menuItem.submenu);
        } else if (menuItem.isMenuItem === 'true') {
            html = '<a href="' + menuItem.href + '" data-toggle="dropdown" class="dropdown-toggle"><i class="' + menuItem.icon + ' cus-nav-icon"></i>&nbsp;' + menuItem.text + ' &nbsp;</a>';
        } else {
            html = '<a href="javascript:;" data-toggle="dropdown" class="dropdown-toggle"><i class="' + menuItem.icon + ' cus-nav-icon"></i>&nbsp;' + menuItem.text + ' &nbsp;</a>';
        }
        return html;
    }

    function getSubMenuItems(subMenuItems) {
        var html = '<ul class="dropdown-menu" >';
        for (var i = 0; i < subMenuItems.length; i++) {

            var subMenuItem = subMenuItems[i];

            //html = html + '<li><a href="' + subMenuItem.href + '">' + subMenuItem.text + '&nbsp;</a></li>';
            html = html + '<li><a href="' + subMenuItem.href + '"><i class="' + subMenuItem.icon + ' cus-nav-icon"></i>&nbsp;' + subMenuItem.text + '&nbsp;</a></li>';
        }
        html = html + '</ul>';
        return html;
    }

});
