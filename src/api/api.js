// import { affixProps } from "element-plus"

// 放置所有的请求接口地址
// const url = 'http://127.0.0.1:3007'\
import axios from 'axios'
const insatnce = axios.create({
    baseURL: 'http://47.115.214.138:3007',
    timeout: 5000,
    headers: {
		// 设置后端需要的传参类型
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
	},
})

    //post请求
export function post(url,data){
        return insatnce.post(url, data)
    }
