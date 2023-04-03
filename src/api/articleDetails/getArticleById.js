import service from '@/untils/service'
export const getArticleById = (data)=>{
    // console.log(data)
    return service.get(`/my/article/${data}`)
}