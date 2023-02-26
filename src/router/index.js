// import Vue from 'vue'
// vue-Router@4.0+的写法
import {createRouter,createWebHashHistory} from 'vue-router'

// Vue.use(VueRouter)
//页面懒加载
const Home = () => import('../views/Home.vue')
const Test = () => import('../views/Test.vue')
const routes = [
    {path: '/', redirect: '/home'},
    //登陆
    {name: 'home', path: '/home', component: Home},
    {path: '/test', component: Test},
]

const router = createRouter({
	history:createWebHashHistory(),
	routes
})


export default router