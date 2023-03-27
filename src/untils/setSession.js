export function setSessionStorage(tokenKey, token){ 
    return sessionStorage.setItem(tokenKey, token)
}
export function getSessionStorage(tokenKey){
    return sessionStorage.getItem(tokenKey)
}
export function deleteSessionStorage(tokenKey){
    return sessionStorage.removeItem(tokenKey)
}

