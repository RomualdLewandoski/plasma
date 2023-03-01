import AbstractController from "../Plasma/Abstract/AbstractController";
import Session from "../Plasma/Security/Session";

export default class PlasmaController extends AbstractController {

    constructor(name, isApp, core) {
        super(name, isApp, core);
    }

    index() {
        if (Session.isSession()){
            PLASMA.routeManager.redirectTo("main")
        }else{
            PLASMA.routeManager.redirectTo("login")
        }
    }

    unload() {

    }
}