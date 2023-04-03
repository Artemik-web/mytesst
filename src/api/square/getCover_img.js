import service from '@/untils/service'
export const getCover_img = async (data) => {
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
        // console.log(data[i])
       await service({
            url: `http://127.0.0.1:3007${data[i].cover_img.replaceAll('\\', '/')}`,
            method: 'get',
            //设置类型才能返回blob对象
            responseType: 'blob'
            // header: `PB_token:${token}`
        }).then(res=>{
            
            data[i].cover_img = URL.createObjectURL(res.data)
        }).catch(err=>{
            console.log(err)
        })
        
    }
    return data
}
export const getCover_img_one = async (data)=>{
    let result = ''
    await service({
        url: `http://127.0.0.1:3007${data.replaceAll('\\', '/')}`,
        method: 'get',
        //设置类型才能返回blob对象
        responseType: 'blob'
        // header: `PB_token:${token}`
    }).then(res=>{
        result = res.data
    }).catch(err=>{
        console.log(err)
    })
    return result
} 