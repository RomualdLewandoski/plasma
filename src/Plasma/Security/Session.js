function isPersistant() {
    return localStorage.getItem("persist") !== null
}

function setPersistent() {
    localStorage.setItem("persist", "true")
}

function removePersistent() {
    localStorage.removeItem("persist")
}

function getToken() {
    return parse(getSession()).token
}

function getUserName() {
    return parse(getSession()).userName
}

function isSession() {
    return getSession() !== null
}

function parse(data) {
    return JSON.parse(data)
}

function getSession() {
    return isPersistant() ? localStorage.getItem("token") : sessionStorage.getItem("token");
}

function setSession(token, userName) {
    let session = {
        userName: userName,
        token: token
    }
    if (isPersistant()) {
        localStorage.setItem("token", JSON.stringify(session))
    } else {
        sessionStorage.setItem("token", JSON.stringify(session))
    }
}

function clearSession() {
    if (isPersistant()) {
        localStorage.removeItem("token")
        removePersistent()
    } else {
        sessionStorage.removeItem("token")
    }
}

function isSelfOnline() {
    if (isPersistant()){
        return localStorage.getItem("online") === null ? false : localStorage.getItem("online")
    }else{
        return sessionStorage.getItem("online") === null ? false : sessionStorage.getItem("online")
    }
}

function isOnline(){
    if (isPersistant()){
        return localStorage.getItem("online") !== null
    }else{
        return sessionStorage.getItem("online") !== null
    }
}

function switchSelfOnline() {
    if (isOnline()) {
        if (isPersistant()){
            localStorage.removeItem("online")
        }else{
            sessionStorage.removeItem("online")
        }
        return false
    } else {
        if (isPersistant()){
            localStorage.setItem("online", "true")
        }else{
            sessionStorage.setItem("online", "true")
        }
        return true
    }
}

export default {
    getToken,
    getUserName,
    setSession,
    isSession,
    clearSession,
    isSelfOnline,
    switchSelfOnline,
    setPersistent,
    removePersistent,
    isOnline
};