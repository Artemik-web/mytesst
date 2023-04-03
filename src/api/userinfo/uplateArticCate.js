import service from '@/untils/service'
export const uplateArticCate = (data)=>{
    return service.post('/my/article/updatecate',data)
}