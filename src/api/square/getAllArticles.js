import service from '@/untils/service'
export const getAllArticles = (data)=>{
    // console.log(data)
    return service.post('/my/article/list',data)
}