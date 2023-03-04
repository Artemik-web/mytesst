// import Vue from 'vue'
// vue-Router@4.0+的写法
import {createRouter,createWebHashHistory} from 'vue-router'
import { removeToken, setToken } from '../untils/setToken'
import { ElMessage } from 'element-plus' 

//页面懒加载
const NotFound = () => import('../views/NotFound.vue')
const Home = () => import('../views/Home.vue')
const UserHome = () => import('../views/userhome.vue')
const routes = [
    {path: '/', redirect: '/home', component: Home},
    {path: '/:catchAll(.*)', redirect: '/notfound', component: NotFound},
    {name: 'home', path: '/home', component: Home},
    {name: 'notfound', path: '/notfound', component: NotFound},
    {name: 'userhome', path: '/userhome', component: UserHome},
    
]

const router = createRouter({
	history:createWebHashHistory(),
	routes
})

//路由导航守卫
router.beforeEach((to, from, next) => {
    //如果token不存在
    if(!localStorage.getItem('PB_token')){
        //那就判断要去的页面是不是home登录
        if(to.path !== '/home'){
            ElMessage({message: '请先登录账号', type: 'error'})
            next('/home')
        }
    }
    //token存在时
    //登陆后存在startTime,设置连续1小时未刷新验证重新登陆
    if(localStorage.getItem('startTime')){
        const now = new Date().getTime()
        const onlineTime = now - localStorage.getItem('startTime')
        // console.log(onlineTime)
        //1小时内有刷新验证则不退出
        if(onlineTime > 3600000){
            ElMessage({message: '长时间未验证账号,请重新登录！', type: 'error'})
            removeToken(['PB_token','username','startTime'])
            next('/home')
        }
        //每次刷新在一小时内就更新startTime
        else{
            setToken('startTime',new Date().getTime())
        }
    }
    
    next()
})

export default router