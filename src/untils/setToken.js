export function setToken(tokenKey, token){ 
    return localStorage.setItem(tokenKey, token)
}
export function getToken(tokenKey){
    return localStorage.getItem(tokenKey)
}
export function removeToken(tokenKey=[]){
    for(let i = 0;i<=tokenKey.length-1;i++){
        localStorage.removeItem(tokenKey[i])
    }
    return 
}
