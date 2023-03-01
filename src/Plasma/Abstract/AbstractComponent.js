export default class AbstractComponents {

    data;

    constructor() {

    }

    setData(data) {
        this.data = data
    }

    /**
     * @abstract
     */
    render() {
        throw new Error("render() must be implemented inside the Component")
    }

    /**
     * @abstract
     */
    script() {
        throw new Error("script() must be implemented inside the Component")
    }

    genTemplate(id, template, dta) {
        let startTime = Date.now()
        $('#' + id).html(template(dta));
        let endTime = Date.now()
        if (PLASMA.debug != null) {
            PLASMA.debug.addTwigRenderTime(endTime - startTime)
        }
    }

    getTemplate(template, dta = {}){
        let startTime = Date.now()
        let genTemplate = template(dta)
        let endTime = Date.now()
        if (PLASMA.debug != null) {
            PLASMA.debug.addTwigRenderTime(endTime - startTime)
        }
        return genTemplate;
    }

    getVue(vueName){
        let template = require('../../../vue/'+vueName)
        return template
    }

}