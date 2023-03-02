import service from '@/untils/service'
export const getUserinfo = () => {
    return service.get('/my/userinfo')
}