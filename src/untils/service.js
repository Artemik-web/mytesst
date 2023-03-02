// import { affixProps } from "element-plus"

// 放置所有的请求接口地址
// const url = 'http://127.0.0.1:3007'\
import axios from 'axios'
import { Promise } from 'core-js'
import { ElMessage } from 'element-plus'
import { getToken } from './setToken'
const httpinsatnce = axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
		// 设置后端需要的传参类型
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'PB_token': localStorage.getItem('PB_token')
	},
})

//添加请求拦截器
httpinsatnce.interceptors.request.use(
    (config) => {
        const token = getToken('PB_token')
        if(token){
            //如果已经有token说明已经登陆，再请求时就可以在请求头携带token
            config.headers.Authorization = localStorage.getItem('PB_token')
        }
        //在请求前要做的(获取并设置token)
        
        return config
    },
    //出现错误时
    (error) => {
        return Promise.reject(error)
    }
)
//添加响应拦截器
httpinsatnce.interceptors.response.use(
    (response) => {
    //对响应数据做什么
        console.log('得到响应数据' + response)
    let {status, message} = response
    console.log(status)
    if (status !== 200){
        ElMessage({message: message || 'error', type: 'warning'})
        return
    }
    return response
    },
    //出现错误时
    (error) => {
        return Promise.reject(error)
    }
)
    //post请求
// export function post(url,data){
//         return httpinsatnce.post(url, data)
//     }

export default httpinsatnce