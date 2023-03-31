<template>
    <div id="app">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>
<script>
// import { computed} from 'vue'
import { useStore } from 'vuex'
// import p_data from './config/public'
export default ({
    //     components: {
    // Test
    //     },
    setup() {
        const store = useStore()
        const getScreen = () => {
            let clientWidth = document.documentElement.clientWidth || document.body.clientHeight;
            if (clientWidth < 768) {
                //当屏幕小于768时，设置Vuex里的数据为true
                store.commit("tigger", 'mobile')
            } else {
                //反之，设置Vuex里的数据为false
                store.commit("tigger", 'pc')
            }
        }
        const setMobile = () => {
            //监听屏幕
            addEventListener('resize', () => {
                getScreen();
            })
        }
        setMobile()
        return {
            // btn,
            // res,
        }
    }



})
</script>

<style lang="less" scoped>
.v-enter-from {
    transform: translateX(-100%);
}

.v-enter-to {
    transform: translateX(0);

}

.v-enter-active {
    transition: all 2s ease;
}


</style>