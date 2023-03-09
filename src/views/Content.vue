<template>
    <div class="userhome">
        <Header></Header>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import Header from '../component/header.vue'
import { useRouter } from 'vue-router'
export default{
    components: {
        Header
    },
    setup(){
        // 创建路由实例来去home页面传过来的params值
        const router = useRouter()
        //接收
        let username = ref('')
        username.value = router.currentRoute.value.params.username
        return {
            username
        }
    }
}
    
</script>
<style lang="scss" scoped>
.userhome {

    .content {
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        padding-top: 56px;
        background-color: aqua;
    }
}
</style>