import service from '@/untils/service'
export const addClassify = (data)=>{
    return service.post('/my/article/addcates',data)
}