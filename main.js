import routes from "./src/config/routes";
import Plasma from "./src/Plasma/Plasma";
import CustomAuthenticator from "./src/security/CustomAuthenticator";
import LangManager from "./src/utils/LangManager";

$(document).ready(() => {
    window.PLASMA = new Plasma(config, routes.getRoutes())
    PLASMA.registerAuthenticator(new CustomAuthenticator())
    PLASMA.registerLangManager(LangManager)
    PLASMA.init()
})