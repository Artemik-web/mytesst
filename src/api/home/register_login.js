import service from '@/untils/service'


// 注册
export const  register = (data) => {
    return service.post('/api/reguser',data)
}
//登录
export const login = (data) =>{
    return service.post('/api/login',data)     
}
