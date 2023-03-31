<template>
    <div class="addSuc">
        文章发布成功
        <el-button @click="goHome">返回主页</el-button>
        <el-button >进入此文章</el-button>
    </div>
</template>
<script>
import router from '../../../router';

export default {
    setup() {
        const goHome = ()=>{
            router.push({name: 'square'})
        }
        // const goCurrentArticle = ()=>{
        //     router.push(`${}`)
        // }
        return {
            goHome
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