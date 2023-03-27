import service from '@/untils/service'
export const getAllArticles = (data)=>{
    // console.log(data)
    return service.get(`/my/article/list/${data}`)
}