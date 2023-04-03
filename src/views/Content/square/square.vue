<template>
    <div class="square">
        <div class="square_content">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabChange">
                <el-tab-pane :key="item.Id" :label="item.name" :name="item.Id" v-for="item in tagData.data">
                    <ul>
                        <li class="nothing" v-if="nothing">
                            这里是知识的荒漠~~~~~
                        </li>
                        <div v-loading="loading" class="articleinfo" :key="index" v-for="(item, index) in articleData.data">
                            <li class="Pb_li" @click="goDetails(item.Id)">
                                <div class="info">
                                    <h2>{{ item.title }}</h2>
                                    <div class="cont"></div>
                                </div>

                                <el-image :class="index % 2 == 0 ? 'coverImgLeft' : 'coverImgRight'" v-loading="img_loading"
                                    :src="item.cover_img" alt="个人博客" />
                            </li>
                            <!-- <div v-html="item.content"></div> -->
                        </div>

                    </ul>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>
<script>
import { reactive, ref, onBeforeUnmount } from 'vue'
import { setSessionStorage, getSessionStorage } from '@/untils/setSession'
import { getClassify } from '@/api/square/getClassify'
import { getAllArticles } from '@/api/square/getAllArticles'
import { getCover_img } from '@/api/square/getCover_img'
// import { useRouter } from "vue-router"
export default {
    setup() {
        // let router = useRouter()
        let nothing = ref(false)
        let activeName = ref('first')
        let loading = ref(false)
        let img_loading = ref(false)
        let tagData = reactive({
            data: []
        })
        let articleData = reactive({
            data: []
        })

        let pageNum = 0
        // 文章分类切换函数，切换后拉取对应分类的所有文章
        const tabChange = async (data) => {
            pageNum = 0
            await getCateArticles(data.paneName)
            //让tab到对应位置
            activeName.value = data.paneName
            scrollStatus.value = false

        }
        //获取文章分类//tagData为所有文章大分类
        getClassify().then(async res => {
            loading.value = true
            tagData.data = res.data.data
            activeName.value = Number(getSessionStorage('activeName')) || tagData.data[0].Id
            // loading.value = false
            // 通过此时的tab对应的activeName(即cate_id)获取对应的文章数据
            await getCateArticles(activeName.value)
        }).catch(err => {
            console.log(err)
        })
        //应为图片是一一对应，可以同过数组对应回去
        let imgBlobUrl = reactive({
            data: []
        })
        // 把获取到的文章数据中的封面从blob二进制装化成base64显示在文章封面
        const blobToBase64 = (data) => {
            console.log(data)
            img_loading.value = true
            getCover_img(data)
                .then(res => {
                    // let imgBlob = []
                    // imgBlob = res
                   
                    //先清理之前的缓存在推入后来得到的
                    // imgBlobUrl.data = []
                    // for (let i = 0; i < imgBlob.length; i++) {
                    //     imgBlobUrl.data.push(URL.createObjectURL(imgBlob[i]))
                    // }
                    articleData.data = res
                    loading.value = false
                    img_loading.value = false
                    console.log('res',articleData.data)
                })
        }
        //获取所有的文章函数
        //data为文章分类
        const getCateArticles = (data) => {
            // scrollStatus.value = false
            pageNum += 1
            // loading.value = true
            // console.log(data)
            getAllArticles({
                cate_id: data,
                pageNum
            }).then(async res => {
                if (pageNum == 1) {
                    articleData.data = []
                }
                if(res.data.status == 1){
                    scrollStatus.value = true
                    if(articleData.data.length == 0){
                        console.log('111111111111',articleData.data)
                        nothing.value = true
                    }
                }else{
                    articleData.data.push(...res.data.data)
                    nothing.value = false
                    await blobToBase64(articleData.data)
                }

               
                    
                loading.value = false
                // console.log(1111111111,getSessionStorage('activeName'))
                setSessionStorage('activeName', data)
                console.log('getAllArticles', res.data.status, activeName.value, pageNum)
            }).catch(err => {
                console.log(err)
            })
        }
        const goDetails = (articleId) => {
            window.open(`/#/square/${articleId}`, '_blank')
            // console.log(router)
        }
        //滚轮刷新拉新
        let scrollStatus = ref(false)
        window.onmousewheel = () => {
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
                    // scrollStatus.value = true
                    getCateArticles(activeName.value)
                    console.log(pageNum + 1, "===加载更多内容……===");
                }
                return


            }
        }
        // 销毁监听  (坑：移除监听事件时加true否则销毁不成功)
        onBeforeUnmount(() => {
            window.removeEventListener("onmousewheel", window.onmousewheel, true)
        })
        return {
            nothing,
            loading,
            img_loading,
            tabChange,
            goDetails,
            activeName,
            tagData,
            articleData,
            imgBlobUrl
        }
    }
}
</script>
<style lang="scss" scoped>
.square_content {
    // // opacity: 0.5;
    // width: 100rem;
    // overflow-y: auto;
    // margin: 0 auto;
    // // padding-top: 56px;
    // // padding-right: 6px;
    // // background: rgb(134, 144, 206) linear-gradient(to right, rgba(0, 255, 0, 0), rgba(10, 33, 233, 0.5));

    .demo-tabs {
        min-height: 100vh;
        // background: #F5DEB3;
        // height: 100vh;

        ul {

            // width: 1000px;
            // margin: 0 auto;
            // text-align: center;

            .nothing {
                line-height: 260px;
            }

            .Pb_li,
            .nothing {
                text-align: center;
                width: 41.6rem;
                height: 21.6rem;
                border-radius: 20px;
                margin: 0 auto 30px;
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

                // .coverImgLeft {
                //     background:rgb(24, 24, 150);
                //     object-fit: cover;

                // }

                // .coverImgRight {
                //     background:  rgb(109, 103, 104);
                //     object-fit: cover;

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

            .Pb_li:hover,
            .nothing:hover {
                cursor: pointer;
                scale: 1.05;
                box-shadow: 1rem 1rem 4.16rem #1956B4;
                // animation: liHoverScale ease-in;
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

}
</style>