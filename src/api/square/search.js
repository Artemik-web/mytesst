import service from '@/untils/service'
export const searchData = (data)=>{
    return service.get(`/my/article/search/q=${data}`)
}  