import service from '@/untils/service'
export const updatePasd = (data)=>{
    return service.post('/my/updatepwd',data)
}