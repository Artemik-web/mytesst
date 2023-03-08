<template>
    <div class="header">
            <ul class="headerbox">
                <li class="logo_li"><a href="https://www.baidu.com" class="logo"></a></li>
                <li><router-link class="router" to="/square">广场</router-link></li>
                <li><router-link class="router" :to="`/${username}`">我的博客</router-link></li>
                
                <!-- <img class="header_avatar" :src="avatarImg" alt=""> -->
            </ul>

    </div>
</template>
<script>
import { useStore } from 'vuex';
// import { getToken } from '../untils/setToken';
export default{
    setup(){
        const store = useStore()
        let username = store.state.username 
        return{
            username
        }
    }
}

</script>

<style lang="scss" scoped>
.header {
    position: fixed;
        width: 100%;
        background-color: #1956B4;

        .headerbox {
            height: 56px;
            width: 1200px;
            margin: 0 auto;
            display: flex;
            line-height: 56px;
            background-color: #1956B4;

            .logo {
                display: inline-block;
                width: 120px;
                height: 56px;
                background-image: url('../assets/image/logo.png');
                background-size: cover;
            }

            li {
                padding: 0 10px;
                user-select: none;
                .router{
                    color: white;
                    font-weight: bold;
                }
            }
            .logo_li{
                padding-right: 50px;
            }

            .header_avatar {
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
            }
        }

    }</style>