import * as vRouter from "vanilla-router"

export default class Router {

    /**
     *
     * @param {Plasma} core
     */
    constructor(core) {
        this.core = core;
        this.routesData = {};
        this.routeName = null;
        this.routeController = null;
        this.hash = window.location.hash;
        if (!this.hash.length) {
            window.location.hash = '#/'
        }
        this.hash = window.location.hash;

        this.vRouter = new vRouter(
            {
                mode: 'hash',
                root: '/',
                page404: function (path) {
                    console.log('"/' + path + '" Page not found');
                }
            }
        )


    }

    registerRoutes() {
        let x
        for (x in this.core.routes) {
            let route = this.core.routes[x];
            let path = route.path + "/"
            if (route.params !== null) {
                let y;
                for (y in route.params) {
                    let param = route.params[y];
                    path = path + param.type + "/"
                }
            }
            this.vRouter.add(path, (...params) => {
                this.core.loadController(route.controller, route.name, route.isApp, route.function == null ? "index" : route.function, params)
            })
        }
        this.vRouter.addUriListener();
    }

    redirectTo(routeName, params = null) {
        let path = ""
        let x
        for (x in this.core.routes) {
            let route = this.core.routes[x];
            if (route.name == routeName) {
                path = route.path + "/"
                let y
                for (y in params) {
                    let param = params[y];
                    path = path + param + "/"
                }
            }
        }
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1)
        }
        this.vRouter.navigateTo(path)
    }

    path(routeName, params = null) {
        let path = ""
        let x
        for (x in this.core.routes) {
            let route = this.core.routes[x];
            if (route.name == routeName) {
                path = route.path + "/"
                let y
                for (y in params) {
                    let param = params[y];
                    path = path + param + "/"
                }
            }
        }
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1)
        }
        return "/#"+path
    }

    getRoute() {
        return this.routeName
    }

    getRoutesData() {
        return this.routesData
    }

    getRouteController() {
        return this.routeController
    }

    /**
     * Set data for actual route
     * @param {string} routeName
     */
    setCurrentRoute(routeName) {
        this.routeName = null;
        this.routesData = {};
        this.routeController = null
        let x
        for (x in this.core.routes) {
            let route = this.core.routes[x];
            if (route.name === routeName) {
                this.routeName = route.name;
                this.routeController = route.controller + " :: " + route.function == null ? "index" : route.function;
                if (route.params !== null) {
                    let hash = window.location.hash
                    hash = hash.replace("#" + route.path + "/", '')
                    let aHash = hash.split("/")
                    let y
                    for (y in aHash) {
                        this.routesData[route.params[y].name] = aHash[y]
                    }
                }
            }
        }
    }

}