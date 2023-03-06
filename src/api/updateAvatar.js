import service from '@/untils/service'
export const updateAvatar = (data) => {
    return service.post('/my/update/avatar',data)
}