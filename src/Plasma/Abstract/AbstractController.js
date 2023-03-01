import Logger from "../Utils/Logger";

export default class AbstractController{
    /**
     *
     * @param {string} name
     * @param {boolean} isApp
     * @param {Plasma} core
     */
    constructor(name, isApp, core) {
        this.name = name
        this.isApp = isApp
        this.core = core
        if (isApp) {
            this.clearApp()
        } else {
            this.clearDashboard()
        }
        Logger.log(Logger.type.INFO, "Loading " + name + " controller")
    }

    clearApp() {
        $('#app').empty()
    }

    clearDashboard() {
        $('#panelPage').empty()
    }

    index() {

    }

    /**
     *
     * @returns {string}
     */
    getName() {
        return this.name
    }

    /**
     *
     * @returns {boolean}
     */
    isItApp() {
        return this.isApp
    }

    /**
     * @returns {Plasma}
     */
    getCore() {
        return this.core
    }

    /**
     * @abstract
     */
    unload() {
        throw new Error("unload() must be implemented on the controller")
    }

}