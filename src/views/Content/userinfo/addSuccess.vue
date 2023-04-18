<template>
    <div class="addSuc">
        文章发布成功
        <el-button @click="goHome">返回主页</el-button>
        <el-button @click="goCurrentArticle" >进入此文章</el-button>
    </div>
</template>
<script>
import router from "@/router";
import { useRoute } from 'vue-router'

export default {
    setup() {
        let route = useRoute()
        const goHome = ()=>{
            router.push({name: 'square'})
        }
        const goCurrentArticle = ()=>{
            console.log(`/#/${route.params.username}/${route.query.articleId}`)
            window.open(`/#/${route.params.username}/${route.query.articleId}`, '_blank')
        }  
        return {
            goHome,
            goCurrentArticle
        }
    }
}
</script>
<style lang="scss" scoped>
.addSuc {
    // height: 100vh;
    background: rgb(134, 144, 206) linear-gradient(to right, rgba(0, 255, 0, 0), rgba(10, 33, 233, 0.5));
}
</style>