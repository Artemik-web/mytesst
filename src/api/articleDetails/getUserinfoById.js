import service from '@/untils/service'
export const getUserinfoById = (data) => {
    return service.post('/my/userinfo', data)
}