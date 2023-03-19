import service from '@/untils/service'
export const deleteCate = (data)=>{
    return service.get(`/my/article/deletecate/${data.id}`)
}