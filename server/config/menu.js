"use strict"

module.exports = {

    headerMenu: [{
            "text": "Admin",
            "href": "#",
            "heading": "true",
            "icon": "fa fa-user",
            "submenu": [{
                    "text": "Users",
                    "href": "/#/userManagement",
                    "icon": "fa fa-users",
                    "module": "Admin",
                    "permission": "UserManagement"
                }, {
                    "text": "Roles",
                    "href": "/#/role",
                    "icon": "fa fa-user",
                    "module": "Admin",
                    "permission": "Role"
                }, {
                    "text": "Permissions",
                    "href": "/#/permission",
                    "icon": "fa fa-check-square-o",
                    "module": "Admin",
                    "permission": "Permission"
                }
            ]
        }
    ]
};
