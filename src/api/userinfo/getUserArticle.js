import service from '@/untils/service'
export const getUserArticleById = (data)=>{
    // console.log(data)
    return service.post('/my/article/userarticle',data)
}