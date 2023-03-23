import service from '@/untils/service'
export const addArticle = (data)=>{
    return service({
        headers: { 'Content-Type': 'multipart/form-data' },
        data,
        method: 'POST',
        url: '/my/article/add'
    })
}