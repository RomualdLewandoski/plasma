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


export default {
    getToken,
    getUserName,
    setSession,
    isSession,
    clearSession,
    setPersistent,
    removePersistent,
};