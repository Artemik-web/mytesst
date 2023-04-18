<template>
    <div class="article_box">
        <div class="classify">
            <div class="release" @click="getUserArticle(data = 1)">已发布</div>
            <div class="draft" @click="getUserArticle(data = 0)">草稿箱</div>
        </div>
        <!-- 分割 -->
        <div class="client">
            <div class="pc">
                <ul class="userArticle">
                    <li class="nothing" v-if="nothing">
                        这里是知识的荒漠~~~~~
                    </li>

                    <div class="articleinfo">
                        <li class="Pb_li" @click="goDetails(item.Id)" :key="index"
                            v-for="(item, index) in userArticle.data">
                            <div class="info">
                                <h2>{{ item.title }}</h2>
                                <div class="cont"></div>
                            </div>
                            <el-image :class="index % 2 == 0 ? 'coverImgLeft' : 'coverImgRight'" v-loading="img_loading"
                                :src="item.cover_img" alt="个人博客" />
                            <div class="editor" @click.stop @click="updateArticle(item.Id)">编辑</div>
                            <div class="delete" @click.stop @click="deleteArticle(item.Id, index)">删除</div>
                        </li>
                        <!-- <div class="end" v-if="(nothing !== true)">
                    拼命加载中.......
                </div> -->
                        <div class="end" v-if="(nothing !== true)">
                            已经到底了~~~
                        </div>
                    </div>

                </ul>
            </div>
            <div class="mobile">

            </div>
        </div>

        <!-- 分割 -->

    </div>
</template>
<script>
import { useStore } from 'vuex'
import {computed, ref, reactive, onBeforeUnmount } from 'vue'
import { getUserArticleById } from "@/api/userinfo/getUserArticle"
import { getCover_img } from "@/api/square/getCover_img"
import { deleteArticleById } from "@/api/userinfo/deleteArticleById"


export default {
    setup(props, context) {
        let img_loading = ref(true)
        let userArticle = reactive({
            data: []
        })
        let store = useStore()
        let client = computed(()=>{
            return store.state.client
        })
        let nothing = ref(false)
        let pageNum = 0
        let state = ''
        const getUserArticle = (data = 1) => {
            //默认为已发布
            state = data ? '已发布' : '草稿'
            pageNum += 1
            getUserArticleById({
                pageNum: pageNum,
                state,
            }).then(res => {
                // console.log(res.data)
                //200状态码且得到的文章数据不为空
                if (res.data.status !== 1 && res.data.data.length !== 0) {
                    let pushData = res.data.data
                    getCover_img(pushData).then(res => {
                        // userArticle.data = res

                        userArticle.data.push(...res)
                        console.log('res', res)
                        console.log('userArticle.data', userArticle.data)
                        img_loading.value = false
                    }).catch(err => {
                        console.log(err)
                    })

                    nothing.value = false
                    scrollStatus.value = false
                    // if (userArticle.data.length == 0) {
                    //     nothing.value = true
                    // } else {
                    console.log(userArticle.data)


                    // }

                }
            }).catch(err => {
                console.log(err)
            })
        }
        //文章页跳转
        const goDetails = (data) => {
            // window.open(`/#/${userRef.value.userData.data.username}/${articleId}`, '_blank')
            context.emit('goDetails', data)
        }
        //文章更新跳转至编辑页
        const updateArticle = (data) => {
            context.emit('updateArticle', data)
        }




        const deleteArticle = (Id, index) => {
            deleteArticleById(Id).then(res => {
                userArticle.data.splice(index, 1)
                console.log(res)
            }).catch(err => {
                console.log(err)
            })

        }
        //滚轮刷新拉新
        let scrollStatus = ref(false)
        const scrollChange = () => {
            //文档内容实际高度（包括超出视窗的溢出部分）
            let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            //滚动条滚动距离
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            //窗口可视范围高度
            let clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
            //距离底部还有0.8视窗高度距离的时候触发加载
            // let canset = clientHeight*0.3
            //定义一个加载状态，防止触发多次拉取
            //scrollTop*2是为了在缩放的情况下也更好的获取到加载效果
            if (clientHeight + scrollTop * 1.01 >= scrollHeight) {
                if (scrollStatus.value == false) {
                    scrollStatus.value = true
                    getUserArticle()
                    console.log(pageNum + 1, "===加载更多内容……===");
                }
                return


            }
        }
        window.addEventListener('scroll', scrollChange)




        // 销毁监听  (坑：移除监听事件时加true否则销毁不成功)
        onBeforeUnmount(() => {
            window.removeEventListener("scroll", scrollChange)
        })





        getUserArticle()
        return {
            client,
            nothing,
            img_loading,
            userArticle,
            updateArticle,
            getUserArticle,
            goDetails,
            deleteArticle,
        }
    }
}

</script>
<style lang="scss" scoped>
.article_box {
    overflow: hidden;

    .classify {
        width: 100%;
        display: flex;

        .release {
            width: 50%;
            line-height: 36px;
            background-color: #409EFF;
        }

        .draft {
            width: 50%;
            line-height: 36px;
            background: #a81cce;
        }
    }

    .userArticle {
        margin: 0 auto;
        padding: 10px;
        border: 1px solid red;

        // width: 1000px;
        // margin: 0 auto;
        // text-align: center;

        .nothing {
            line-height: 260px;
        }

        .Pb_li,
        .nothing {
            margin: 10px;
            display: inline-block;
            border: 1px solid red;
            text-align: center;
            width: calc( 50% - 20px);
            max-height: 25vh;
            border-radius: 20px;
            // margin: 0 auto 30px;
            background: rgba(255, 255, 255, .5);
            scale: 1;
            transition: scale 0.5s;
            overflow: hidden;
            backdrop-filter: blur(6px);
            // background: linear-gradient(to right, rgb(24, 24, 150), rgb(109, 103, 104));
            // animation: fadeInAnimation ease 1s;

            .info {
                word-wrap: break-word;
                line-height: 3rem;
                text-align: center;
                width: 100%;
            }

            .el-image {
                overflow: hidden;
                // background: rgb(109, 103, 104);
                width: 90%;
                height: 15rem;
            }

        }

        .Pb_li {
            position: relative;

            .editor,
            .delete {

                text-align: center;
                width: 50px;
                line-height: 50px;
                border-radius: 50%;
                position: absolute;
                top: calc(50% - 25px);
                right: calc(50% - 25px);
                display: none;
                animation-fill-mode: forwards;
                // right: calc(50% - 25px);
            }

            .editor {

                background: rgba($color: #939bf2, $alpha: .5);
            }

            .delete {
                background: rgba($color: #ea4c4c, $alpha: .5);
            }
        }

        .end {
            padding: 20px 0;
            text-align: center;
        }

        .Pb_li:hover,
        .nothing:hover {
            cursor: pointer;
            scale: 1.05;
            box-shadow: 1rem 1rem 4.16rem #1956B4;

            // animation: liHoverScale ease-in;
            .editor {
                display: block;
                animation: editor ease 1s;
                animation-fill-mode: forwards;
            }

            .delete {
                display: block;
                animation: delete ease 1s;
                animation-fill-mode: forwards;
            }

            .editor:hover {
                z-index: 999;
                background-color: #939bf2;
            }

            .delete:hover {
                z-index: 2;
                background-color: #ea4c4c;
            }
        }

        @keyframes editor {
            0% {
                opacity: 0;
                // right: calc(50% - 25px);

            }

            100% {
                opacity: 1;
                right: calc(100% - 50px);
            }
        }

        @keyframes delete {
            0% {
                opacity: 0;
                // right: calc(50% - 25px);

            }

            100% {
                opacity: 1;
                right: 0;
            }
        }

        @keyframes liHoverScale {
            from {
                scale: 1.0;
            }

            to {
                scale: 1.1;
            }
        }
    }
}
</style>