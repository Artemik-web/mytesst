<template>
    <div class="userhome">
        <Header></Header>
        <div class="content">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import Header from '../component/header.vue'
import { useRouter } from 'vue-router'
export default {
    components: {
        Header
    },
    setup() {
        // 创建路由实例来去home页面传过来的paams值
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
        // opacity: 0.5;
        width: 100rem;
        margin: 0 auto;
        padding-top: 56px;
        // 淡入淡出
        // .page{ 
        //     animation: fadeInAnimation ease 1s; 
        //     animation-iteration-count: 1; 
        //     animation-fill-mode: forwards; 
        // } 
        // @keyframes fadeInAnimation { 
        //     0% { 
        //         opacity: 0; 
        //     } 
        //     100% { 
        //         opacity: 1; 
        //     } 
        // }
    }
}
</style>