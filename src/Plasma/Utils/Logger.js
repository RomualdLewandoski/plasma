export default class Logger {
    static type = {
        INFO: "info",
        WARN: "warning",
        SEVERE: "severe"
    }
    static log(type, message){
        console.log("[Plasma] - ", type.toUpperCase() + " : " + message)
    }

}