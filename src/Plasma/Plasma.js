import PoolManager from "./Pools/PoolManager";
import Router from "./router";
import Twig from 'twig'
import Debug from "./Debug/Debug";

var storage = {};

export default class Plasma {

    /**
     *
     * @param {{}} config
     * @param {[]} routes
     */
    constructor(config, routes) {
        this.version = "Alpha-0.0.5-b"
        this.app = this
        this.config = config
        this.routes = routes
        this.authenticator = null;
        this.routeManager = new Router(this);
        this.poolManager = new PoolManager();
        this.langManager = null;
        if (window.ENV == "dev") {
            this.debug = new Debug();
        } else {
            this.debug = null;
        }

    }

    init() {
        this.registerRoutes()

        Twig.extendFunction("app", function () {
            return this.app
        })

        Twig.extendFunction("translate", function (value, toLower = false) {
            if (PLASMA.langManager == null) {
                return value
            } else {
                return toLower ? value in PLASMA.langManager.getLang() ? PLASMA.langManager.getLang()[value].toLowerCase() : value :
                    value in PLASMA.langManager.getLang() ? PLASMA.langManager.getLang()[value] : value
            }
        });

        Twig.extendFunction("getDate", function (value, multiplier = 1) {
            return new Date(value * multiplier).toLocaleDateString() + " " + new Date(value * multiplier).toLocaleTimeString()
        })

        Twig.extendFunction("getRouter", function () {
            return PLASMA.routeManager.getRoute()
        })
        Twig.extendFunction("getRouteData", function () {
            return PLASMA.routeManager.getRoutesData()
        })
        Twig.extendFunction("path", function (routeName , params = null) {
            return PLASMA.routeManager.path(routeName, params)
        })

        this.routeManager.vRouter.check()
        if (this.debug != null) {
            this.debug.firstCheck = true
            Window.initTime = Date.now()
        }
    }

    registerAuthenticator(authenticator) {
        this.authenticator = authenticator;
    }

    registerLangManager(langManager) {
        this.langManager = langManager;
    }

    /**
     * Register all routes here
     */
    registerRoutes() {
        this.routeManager.registerRoutes();
    }

    clearStorage() {
        if (storage.instance != null || storage.instance !== undefined) {
            storage.instance.unload()
            delete storage.instance;
        }
    }

    /**
     * Load the controller and the render method
     * @param {string} targetController
     * @param {string} name
     * @param {boolean} isApp
     * @param {string} func
     * @param {string[]} params
     */
    async loadController(targetController, name, isApp, func = "index", params) {
        if (this.debug != null && !this.debug.firstCheck) {
            Window.debug_start = Date.now()
            this.debug.ajax = []
            this.debug.twigTime = 0;
            this.debug.twigCall = 0;
        }
        this.clearStorage()
        let target = await import('../controller/' + targetController);
        target = target.default
        var controller = new target(
            targetController,
            isApp,
            this.app
        )
        storage.instance = controller;
        let reflector = Reflect.getPrototypeOf(controller);
        if (Reflect.ownKeys(reflector).includes(func)) {
            this.routeManager.setCurrentRoute(name)
            controller[func](params)
            if (this.debug != null) {
                if (this.debug.firstCheck) {
                    this.debug.controller = targetController + " :: " + func
                    Window.debug_end = Date.now();
                    this.debug.firstRender()
                } else {
                    this.debug.controller = targetController + " :: " + func
                    Window.debug_end = Date.now();
                    this.debug.updateBar()
                }
            }
        } else {
            throw new Error(func + " is not defined inside the controller")
        }

    }

    getAuthenticator() {
        return this.authenticator
    }

    getStorage() {
        return storage
    }

    getConfig() {
        return this.config
    }

    getVersion() {
        return this.version
    }

}