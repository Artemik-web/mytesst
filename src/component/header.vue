<template>
    <div class="header">
        <ul class="headerbox">
            <li class="logo_li" v-if="client === 'pc'"><a href="http://www.personalblog.cn" class="logo">PERESONAL-BLOG</a></li>
            <li><router-link class="router" active-class="active" to="/develop" exact>开发者工具</router-link></li>
            <li><router-link class="router" active-class="active" to="/square" exact>广场</router-link></li>
            <li><router-link class="router" active-class="active" :to="`/${username}`" exact>我的博客</router-link></li>
            <!-- <li @click="goSquare">广场</li>
            <li @click="goBlog">我的博客</li> -->

            <!-- <img class="header_avatar" :src="avatarImg" alt=""> -->
        </ul>
    </div>
</template>
<script>
import { computed,reactive } from 'vue';
import { useStore } from 'vuex';
// import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { getToken } from '../untils/setToken';
export default {
    setup() {
        const active = reactive({
            class: {
                square: '',
                blog: '',
            }
        })
        const store = useStore()
        let client = computed(()=>{
            return store.state.client
        }) 
        let route = useRoute()
        console.log(route.path)
        let username = store.state.username || getToken('username')
    //    }
        return {
            // isLoading,
            client,
            active,
            username,
            // goBlog,
            // goSquare
        }
    }
}

</script>

<style lang="scss" scoped>
.header {

    position: fixed;
    z-index: 1029;
    width: 100vw;
    background-color: #8EB3DF;

    .headerbox {
        height: 56px;
        // width: 100%;
        // width: 100rem;
        margin: 0 auto;
        display: flex;
        line-height: 56px;

        .logo {
            display: inline-block;
            width: 120px;
            height: 56px;
            // background-image: url('../assets/image/logo.png');
            background-size: cover;
        }

        li {
            padding: 0 10px;
            user-select: none;

            .router {
                color: white;
                font-weight: bold;

            }

            .active {
                padding-bottom: 8px;
                border-bottom: 2px blue solid;
                color: #0C2745;
                
            }

        }

        .logo_li {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            white-space:nowrap;
            padding-right: 50px;
        }

        .header_avatar {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
        }
    }

}</style>