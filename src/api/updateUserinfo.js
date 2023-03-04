import service from '../untils/service'

export const updateUserinfo = (data)=>{
    return service.post('/my/userinfo', data)
}