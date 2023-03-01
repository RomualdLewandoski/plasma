import Logger from "../Utils/Logger";

export default class Auth {
    constructor() {
        Logger.log(Logger.type.INFO, "Auth loaded");
    }

    /**
     * @abstract
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    async login(email, password) {
        throw new Error("login() must be implemented on the Authenticator class");
    }

    /**
     * @abstract
     * @returns {Promise<void>}
     */
    async logout() {
        throw new Error("logout() must be implemented on the Authenticator class");
    }

}
