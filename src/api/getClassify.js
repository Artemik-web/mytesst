import service from '@/untils/service'
export const getClassify = ()=>{
    return service.get('/my/article/cates')
}