import service from '@/untils/service'
export const searchTips = (data)=>{
    return service.get(`/my/article/search/tips=${data}`)
}  