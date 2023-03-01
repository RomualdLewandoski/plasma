import Session from "../Security/Session";

export default class Debug {
    constructor() {
        this.firstCheck = false
        this.twigTime = 0;
        this.twigCall = 0;
        this.ajax = [];
        this.controller = "";
    }

    firstRender() {
        //on va draw le twig ici et passer les datas
        let template = require('./debug-bar.twig')
        let totalLoadTime = Window.debug_end - Window.debug_start

        let loadClass = totalLoadTime < 3000 ? totalLoadTime < 600 ? "sf-toolbar-status-green" : "sf-toolbar-status-yellow" : "sf-toolbar-status-red"
        let isSession = Session.isSession()
        let sessionName = isSession ? Session.getUserName() : null
        let initTime = Window.initTime - Window.debug_start
        let data = {
            routeName: PLASMA.routeManager.getRoute(),
            totalLoadTime: totalLoadTime,
            initTime: initTime,
            loadClass: loadClass,
            isSession: isSession,
            sessionName: sessionName,
            twigTime: this.twigTime,
            twigCall: this.twigCall,
            ajax: this.ajax,
            plasmaVersion: PLASMA.getVersion(),
            controller: this.controller
        }
        $('body').append(template(data))
        this.firstCheck = false

    }

    updateBar(){
        $('#ajaxTable').html("")
        $('#debug-routeName').html(PLASMA.routeManager.getRoute())
        $('#debug-controller').html(this.controller)
        $('#debug-routeName2').html(PLASMA.routeManager.getRoute())
        let loadTime = Window.debug_end - Window.debug_start
        $('#debug-loadTime').html(loadTime)
        $('#debug-loadTime2').html(loadTime + " ms")
        //push ajax here
        $('#ajaxCount1').html(this.ajax.length)
        $('#ajaxCount2').html(this.ajax.length + " AJAX requests")
        let x
        for (x in this.ajax) {
            let ajx = this.ajax[x]
            let template = `
            <tr>
                <td>${ajx.id}</td>
                <td>${ajx.method}</td>
                <td>${ajx.code}</td>
                <td>${ajx.url}</td>
                <td>${ajx.totalTime} ms</td>
            </tr>
            `
            $('#ajaxTable').append(template)
        }

        if (Session.isSession()){
            $('#debug-session').html(Session.getUserName())
            $('#debug-sessionlog').removeClass("sf-toolbar-status-yellow")
            $('#debug-sessionlog').addClass("sf-toolbar-status-green")
            $('#debug-sessionlog').html("Yes")
        }else{
            $('#debug-session').html("n/a")
            $('#debug-sessionlog').removeClass("sf-toolbar-status-green")
            $('#debug-sessionlog').addClass("sf-toolbar-status-yellow")
            $('#debug-sessionlog').html("No")
        }
        $('#debug-twigTime').html(this.twigTime)
        $('#debug-twigTime2').html(this.twigTime  + " ms")
        $('#debug-twigCall').html(this.twigCall)
    }

    addAjaxRequest(url, method, startTime, endTime, code) {
        let totalTime = endTime - startTime
        let ajax = {
            id: this.ajax.length + 1,
            url: url,
            method: method,
            startTime: startTime,
            endTime: endTime,
            code: code,
            totalTime: totalTime
        }
        this.ajax.push(ajax)
        if (!this.firstCheck) {
            $('#ajaxCount1').html(this.ajax.length)
            $('#ajaxCount2').html(this.ajax.length + " AJAX requests")

            let template = `
            <tr>
                <td>${ajax.id}</td>
                <td>${ajax.method}</td>
                <td>${ajax.code}</td>
                <td>${ajax.url}</td>
                <td>${ajax.totalTime} ms</td>
            </tr>
            `
            $('#ajaxTable').append(template)
        }

    }

    addTwigRenderTime(time) {
        this.twigTime = this.twigTime + time;
        this.twigCall = this.twigCall + 1;
    }
}