// import Vue from 'vue'
// vue-Router@4.0+的写法
import {createRouter,createWebHashHistory} from 'vue-router'

// Vue.use(VueRouter)
//页面懒加载
const NotFound = () => import('../views/NotFound.vue')
const Home = () => import('../views/Home.vue')
const Test = () => import('../views/Test.vue')
const routes = [
    {path: '/', redirect: '/home', component: Home},
    {path: '/:catchAll(.*)', redirect: '/notfound', component: NotFound},
    {name: 'home', path: '/home', component: Home},
    {name: 'notfound', path: '/notfound', component: NotFound},
    {name: 'test', path: '/test', component: Test},
    
]

const router = createRouter({
	history:createWebHashHistory(),
	routes
})


export default router