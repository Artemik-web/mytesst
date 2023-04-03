import service from '@/untils/service'
export const deleteArticleById = (data)=>{
    return service.post(`/my/article/delete/${data}`)
}