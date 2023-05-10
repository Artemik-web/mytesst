<template>
    <div class="detail_content">
        <div class="author" v-if="client === 'pc'">
            <ul class="info">
                <li>头像：<el-avatar
                        :src="authorInfo.data.user_pic || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
                </li>
                <li>昵称：{{ authorInfo.data.nickname }}</li>
                <li>id: {{ authorInfo.data.id }}</li>
                <li>邮箱: {{ authorInfo.data.email }}</li>
            </ul>
            <ul class="fx">
                <li>节点/锚点</li>
                <li>节点/锚点</li>
                <li>节点/锚点</li>
                <li>节点/锚点</li>
            </ul>
        </div>
        <div :class="client === 'pc' ? 'details' : 'w100'">
            <span class="back" @click="back">文章详情页</span>
            <div class="title">{{ details.data.title }}</div>
            <ul class="tips">
                <li>
                    <el-avatar v-if="client === 'mobile'"
                        :src="authorInfo.data.user_pic || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
                    {{ authorInfo.data.nickname }} 于{{ details.data.pub_date }}发布
                </li>
            </ul>
            <div class="article" v-html="details.data.content"></div>
        </div>

    </div>
</template>
<script>
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import { useStore } from "vuex";
import { computed, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getArticleById } from '@/api/articleDetails/getArticleById'
import { getUserinfoById } from '@/api/articleDetails/getUserinfoById'
import { setSessionStorage, getSessionStorage } from '@/untils/setSession'
export default {
    setup() {
        //
        const store = useStore()
        let client = computed(() => {
            return store.state.client
        })
        window.addEventListener("scroll", scrollTop)
        function scrollTop() {
            setTimeout(() => {
                // console.log(document.documentElement.scrollTop)
                setSessionStorage('scrollTop', document.documentElement.scrollTop)
            }, 500)

        }
        const top = getSessionStorage('scrollTop')
        setTimeout(() => {
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }, 500)

        let details = reactive({
            data: []
        })
        let authorInfo = reactive({
            data: []
        })
        const route = useRoute()
        getArticleById(route.params.articleId).then(async res => {
            details.data = res.data.data
            await getUserinfoById({
                id: res.data.data.author_id
            }).then(res => {
                authorInfo.data = res.data.data
                const codeTag = document.querySelectorAll('code')
                console.log(codeTag)
                codeTag.forEach(element => {
                    element.classList.add('line-numbers')
                });
                Prism.highlightAll()

            })
        }).catch(err => {
            console.log(err)
        })
        onMounted(() => {
            // Prism.highlightAll()
            // setTimeout(()=>{
            //     Prism.highlightAll()
            // },2000)

        })
        const back = () => {
            window.history.go(-1)
        }
        const toFixed = ()=>{
            // console.log(document.documentElement.scrollTop)
            //不是pc端的情况下不调用
            if(client.value !== 'pc') return
            const topVal = document.documentElement.scrollTop
            if(topVal >= 250){
                // document.getElementsByClassName('fx')[0].classList.add('maod')
                document.getElementsByClassName('fx')[0].style.position = 'fixed'
                document.getElementsByClassName('fx')[0].style.top = '76px'
            }else{
                document.getElementsByClassName('fx')[0].style.position = 'relative'
                document.getElementsByClassName('fx')[0].style.top = '0'
            }
        }
        window.addEventListener('scroll', toFixed)
        // 销毁监听  (坑：移除监听事件时加true否则销毁不成功)
        onBeforeUnmount(() => {
            window.removeEventListener("scroll", toFixed,scrollTop)
        })
        return {
            back,
            client,
            details,
            authorInfo,
        }
    }

}
</script>
<style lang="scss">
.detail_content {
    position: relative;
    padding: 20px;
    min-width: 250px;

    .author {
        background-color: rgba($color: #fff, $alpha: 0.5);
        // backdrop-filter: blur(6px);
        width: calc((20% - 20px));
        // height: 200px;
        border: 1px red solid;
        border-radius: 8px;
        position: absolute;
        right: 20px;
        .info{

        }
        .fx{
            transition: top .5s ease;
            border: 1px red solid;
        }
        // .maod{
        //     position: fixed;
        //     top: 76px;
            
            
        // }
        
    }

    .details,
    .w100 {
        background-color: rgba($color: #fff, $alpha: 0.5);
        backdrop-filter: blur(6px);
        border-radius: 8px;
        width: 80%;
        padding: 10px 0;
        line-height: 20px;

        // background: #113cd7;
        .back {
            display: block;
            width: 50px;
            line-height: 30px;
        }

        .title {
            font-size: 5rem;
            font-weight: bold;
            line-height: 5rem;
            text-align: center;

        }

        .tips {
            display: flex;
            line-height: 20px;
            padding: 5px 60px;

            .el-avatar {
                height: 20px;
                width: 20px;
                vertical-align: middle;
            }

            li {
                word-break: keep-all;
            }
        }

        img {
            scale: 1;
            max-width: 100%;
            object-fit: contain;
            transition: scale 0.5s;
        }

        img:hover {

            cursor: pointer;
            scale: 1.05;
        }





        .article {
            border: 2px #8FB1D7 solid;
            word-break: break-all;
            // max-width: 300px;
            // background: #446D9B;
            margin: 5rem 1rem;
            padding: 5px 1rem;
        }
    }

    .w100 {
        width: 100%;
    }


}</style>