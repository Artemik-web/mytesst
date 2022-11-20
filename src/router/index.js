// import Vue from 'vue'
// vue-Router@4.0+的写法
import {createRouter,createWebHashHistory} from 'vue-router'

// Vue.use(VueRouter)
//页面懒加载
const Login = () => import('../views/Login.vue')
const Test = () => import('../views/Test.vue')
const Home = () => import('../views/Home.vue')
const routes = [
    {path: '/', redirect: '/login'},
    //登陆
    {name: 'login', path: '/Login', component: Login},
    {path: '/test', component: Test},
    {path: '/home', component: Home}
]

const router = createRouter({
	history:createWebHashHistory(),
	routes
})


export default router