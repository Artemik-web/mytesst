// import Vue from 'vue'
// vue-Router@4.0+的写法
import { createRouter, createWebHashHistory } from 'vue-router'
import { removeToken, setToken } from '@/untils/setToken'
import { ElMessage } from 'element-plus'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// import { getToken } from '@/untils/setToken'


//页面懒加载
const NotFound = () => import('@/views/NotFound.vue')
const Home = () => import('@/views/Home.vue')
const contentSpace = () => import('@/views/Content.vue')
const squareSpace = () => import('@/views/Content/squareSpace.vue')
const square = () => import('@/views/Content/square/square.vue')
const articleDetails = () => import('@/views/Content/square/articleDetails.vue')
const userArticleDetails = () => import('@/views/Content/square/articleDetails.vue')
const userInfoSpace = () => import('@/views/Content/userInfoSpace.vue')
const userInfo = () => import('@/views/Content/userinfo/userInfo.vue')
const addArticle = () => import('@/views/Content/userinfo/addArticle.vue')
const updateArticle = () => import('@/views/Content/userinfo/addArticle.vue')
const addSuccess = () => import('@/views/Content/userinfo/addSuccess.vue')


const routes = [
    { path: '/', redirect: '/home', component: Home },

    { name: 'home', path: '/home', component: Home },
    {
        name: 'content', path: '/square', component: contentSpace
        ,
        children: [
            {
                name: 'squareSpace', path: '/square', component: squareSpace,
                children: [
                    { name: 'square', path: '/square', component: square },
                    { name: 'articleDetails', path: '/square/:articleId', component: articleDetails },
                ]
            }
            // {
            //     name: 'squareSpace', path: '/square', component: squareSpace,
            //     children: [
            //         { name: 'articleSquare', path: '/articleSquare', component: square },
            //         { name: 'articleDetails', path: '/square/:articleId', component: articleDetails },
            //     ]
            // }
            ,
            {
                name: 'userInfoSpace', path: '/:username', component: userInfoSpace,
                children: [
                    // { name: 'square', path: '/:username/square', component: square },
                    { name: 'userInfo', path: '/:username', component: userInfo },
                    { name: 'userArticle', path: '/:username/:articleId', component: userArticleDetails},
                    { name: 'addArticle', path: '/:username/addArticle', component: addArticle },
                    { name: 'updateArticle', path: '/:username/updateArticle', component: updateArticle },
                    { name: 'addSuccess', path: '/:username/addArticle/addSuccess', component: addSuccess },

                ]
            },
        ]
    },

    { name: 'notfound', path: '/notfound', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/notfound', component: NotFound },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//路由导航守卫
router.beforeEach((to, from, next) => {
    //如果token不存在
    if (!localStorage.getItem('PB_token')) {
        //那就判断要去的页面是不是home登录
        if (to.path !== '/home') {
            ElMessage({ message: '请先登录账号', type: 'error' })
            NProgress.start()
            next({ name: 'home' })
        }
    }
    //token存在时
    //登陆后存在startTime,设置连续1小时未刷新验证重新登陆
    if (localStorage.getItem('startTime')) {
        const now = new Date().getTime()
        const onlineTime = now - localStorage.getItem('startTime')
        // console.log(onlineTime)
        //1小时内有刷新验证则不退出
        if (onlineTime > 36000000) {
            ElMessage({ message: '长时间未验证账号,请重新登录！', type: 'error' })
            removeToken(['PB_token', 'username', 'startTime'])
            NProgress.start()
            next({ name: 'home' })
        }
        //每次刷新在一小时内就更新startTime
        else {
            setToken('startTime', new Date().getTime())
        }
    }
    NProgress.start()
    next()
})
router.afterEach(() => {
    NProgress.done()
  })
export default router