'use strict';

var menu = require("../../config/menu.js");

exports.loadMenu = function (usrPermission, resultData) {
    var formattedMenu = [];
    var k = 0;

    for (var i = 0; i < menu.headerMenu.length; i++) {
        if (menu.headerMenu[i].submenu !== undefined) {
            for (var j = 0; j < menu.headerMenu[i].submenu.length; j++) {
                if (menu.headerMenu[i].submenu[j].module !== undefined && menu.headerMenu[i].submenu[j].permission !== undefined) {
                    var mod = menu.headerMenu[i].submenu[j].module;
                    var per = menu.headerMenu[i].submenu[j].permission;
                    if (!(usrPermission[mod][per] === undefined || usrPermission[mod][per].read === undefined || !usrPermission[mod][per].read)) {
                        if (formattedMenu[k] === undefined) {
                            formattedMenu.push({
                                "text": menu.headerMenu[i].text,
                                "href": menu.headerMenu[i].href,
                                "icon": menu.headerMenu[i].icon,
                                "heading": menu.headerMenu[i].heading,
                                "isMenuItem": menu.headerMenu[i].isMenuItem,
                                submenu: []
                            });
                        }
                        formattedMenu[k].submenu.push(menu.headerMenu[i].submenu[j]);
                    }
                }
            }
        } else {
            if (menu.headerMenu[i].module !== undefined && menu.headerMenu[i].permission !== undefined) {

                var mod1 = menu.headerMenu[i].module;
                var per1 = menu.headerMenu[i].permission;
                if (!(usrPermission[mod1][per1] === undefined || usrPermission[mod1][per1].read === undefined || !usrPermission[mod1][per1].read)) {
                    if (formattedMenu[k] === undefined) {
                        formattedMenu.push({
                            "text": menu.headerMenu[i].text,
                            "href": menu.headerMenu[i].href,
                            "icon": menu.headerMenu[i].icon,
                            "heading": menu.headerMenu[i].heading,
                            "isMenuItem": menu.headerMenu[i].isMenuItem
                        });
                    }
                }
            }
        }
        if (formattedMenu[k] !== undefined) {
            k++;
        }
    }
    processResult(formattedMenu);

    function processResult(formattedMenu) {
        resultData(formattedMenu);
    }
}

