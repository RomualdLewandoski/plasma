import Map from 'collections/map'
import routes from "./src/config/routes";
import Plasma from "./src/Plasma/Plasma";
import CustomAuthenticator from "./src/security/CustomAuthenticator";
import LangManager from "./src/utils/LangManager";
import apiRoutes from "./src/config/apiRoutes";

var checkStaffTimer, isCheckStaff

$(document).ready(() => {
    /*window.CORE = new Core()
    CORE.init()*/

    window.PLASMA = new Plasma(config, routes.getRoutes())
    PLASMA.registerAuthenticator(new CustomAuthenticator())
    PLASMA.registerLangManager(LangManager)
    PLASMA.init()

})