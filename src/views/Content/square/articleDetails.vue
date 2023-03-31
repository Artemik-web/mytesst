<template>
    <div class="detail_content">
        <div class="author">
            <ul class="info">
                <li>头像：<el-avatar
                        :src="authorInfo.data.user_pic || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
                </li>
                <li>昵称：{{ authorInfo.data.nickname }}</li>
                <li>id: {{ authorInfo.data.id }}</li>
                <li>邮箱: {{ authorInfo.data.email }}</li>
            </ul>
        </div>
        <div class="details">
            文章详情页
            <div class="title">{{ details.data.title }}</div>
            <ul class="tips">
                <li>
                    {{ authorInfo.data.nickname }} 于{{ details.data.pub_date }}发布
                </li>
            </ul>
            <div class="article" v-html="details.data.content"></div>
        </div>

    </div>
</template>
<script>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getArticleById } from '@/api/getArticleById'
import { getUserinfoById } from '@/api/getUserinfoById'
import { setSessionStorage, getSessionStorage } from '@/untils/setSession'
export default {
    setup() {

        //
        window.addEventListener("scroll", scrollTop)
        function scrollTop() {
            setTimeout(() => {
                console.log(document.documentElement.scrollTop)
                setSessionStorage('scrollTop', document.documentElement.scrollTop)
            }, 500)

        }
       const top = getSessionStorage('scrollTop')
        setTimeout(()=>{ 
            window.scrollTo({
            top: top,
            behavior: "smooth"
        });
        },500)
        
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
            })
        }).catch(err => {
            console.log(err)
        })
        return {
            details,
            authorInfo,
        }
    }

}
</script>
<style lang="scss">
.detail_content {
    // height: 100vh;
    // overflow-y: auto;

    .author {
        width: 15rem;
        height: 200px;
        float: left;
        background-color: aquamarine;
    }

    .details {
        width: auto;
        margin-left: 15rem;
        padding-top: 20px;
        background: #113cd7;

        img {
            scale: 1;
            -webkit-transition: scale 0.5s;
        }

        img:hover {
            cursor: pointer;
            scale: 1.05;
        }

        .title {
            width: 100%;
            font-size: 5rem;
            font-weight: bold;
            line-height: 8.33rem;
            text-align: center;
            background: #e37691;

        }

        .tips {
            display: flex;
            padding: 5px 60px;

            li {
                background-color: aqua;
            }
        }

        .article {
            background: #d65b99;
            width: 85rem;
            padding: 5rem 2rem;
        }
    }


}
</style>