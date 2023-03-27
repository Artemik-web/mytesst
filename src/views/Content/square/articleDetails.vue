<template>
    <div class="content">
        
        <div class="author">
            <ul class="info">
            <li>头像：<el-avatar :src="authorInfo.data.user_pic" /></li>
            <li>昵称：{{ authorInfo.data.nickname }}</li>
            <li>id: {{ authorInfo.data.id }}</li>
            <li>邮箱: {{ authorInfo.data.email }}</li>
          </ul>
        </div>
        <div class="details">
            文章详情页
            <div class="title">{{ details.data.title }}</div>
        <div class="tips">{{ details.data.pub_date }}</div>
        <div class="article" v-html="details.data.content"></div>
        </div>
        
    </div>
</template>
<script>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getArticleById } from '@/api/getArticleById'
import { getUserinfo } from '@/api/getUserinfo'

export default {
    setup() {
        let details = reactive({
            data: []
        })
        let authorInfo = reactive({
            data: []
        })
        const route = useRoute()
        getArticleById(route.params.articleId).then(async res => {
            details.data = res.data.data
            await getUserinfo(res.data.data.author_id).then(res=>{
                authorInfo.data = res.data.data
            })
        }).catch(err=>{
            console.log(err)
        })
        return {
            details,
            authorInfo
        }
    }

}
</script>
<style lang="scss">
.content{
    .author{
        width: 100px;
        height: 200px;
        float: left;
        background-color: aquamarine;
    }
    .details{
        width: auto;
        margin-left: 100px;
        background: #113cd7;
        .title{
        line-height: 100px;
        text-align: center;
    }
    }
    

}
</style>