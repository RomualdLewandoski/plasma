export default {
    getRoutes
}

function getRoutes() {
    return [
        {
            name: 'app',
            path: '',
            controller: "PlasmaController",
            isApp: true,
            function: null,
            params: null
        },
        {
            name: 'main',
            path: 'main',
            controller: "MainController",
            isApp: true,
            function: null,
            params: null
        },
        {
            name: 'login',
            path: 'login',
            controller: "LoginController",
            isApp: true,
            function: null,
            params: null
        },
        {
            name: 'users',
            path: 'users',
            controller: "UsersController",
            isApp: true,
            function: null,
            params: null
        },
        {
            name: 'user_show',
            path: 'users/show',
            controller: "UsersController",
            isApp: true,
            function: "show",
            params: [
                {
                    name: "id",
                    type: '(:any)'
                }
            ]
        },
        {
            name: 'user_edit',
            path: 'users/edit',
            controller: "UsersController",
            isApp: true,
            function: "edit",
            params: [
                {
                    name: "id",
                    type: '(:any)'
                }
            ]
        },
        {
            name: 'ticket_create',
            path: 'ticket/create',
            controller: "TicketController",
            isApp: true,
            function: "create",
            params: [
                {
                    name: "id",
                    type: '(:any)'
                }
            ]
        },
        {
            name: 'tickets',
            path: 'tickets',
            controller: "TicketController",
            isApp: true,
            function: null,
            params: null
        },
        {
            name: 'ticket_show',
            path: 'ticket/read',
            controller: "TicketController",
            isApp: true,
            function: "show",
            params: [
                {
                    name: "id",
                    type: '(:any)'
                }
            ]
        },
        {
            name: "sanction_list",
            path: "sanctions",
            controller: "SanctionController",
            isApp: true,
            function: null,
            params: null
        },
        {
            name: 'sanction_show',
            path: 'sanctions/show',
            controller: "SanctionController",
            isApp: true,
            function: "show",
            params: [
                {
                    name: "id",
                    type: '(:any)'
                }
            ]
        },
        {
            name: 'server_show',
            path: 'server',
            controller: "ServerController",
            isApp: true,
            function: null,
            params: [
                {
                    name: "name",
                    type: '(:any)'
                }
            ]
        },
    ];
}