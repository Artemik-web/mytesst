<template>
    <div class="square">
        <div class="square_content">
            <div class="searchBox">
                <div class="search">
                    <el-input placeholder="search" v-model="searchStr" @input="searchTip"></el-input>
                    <el-button @click="search" class="iconfont icon-chazhao"></el-button>
                    <div class="box" v-if="searchBox">
                        <ul>
                            <li class="article" :key="index" v-for="(item, index) in searchRes.data">
                                <div @click="changeTip(item.title)">
                                    <h4>{{ item.title }}</h4>
                                    <!-- <div>{{ item.content }}</div> -->
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>


            </div>
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
import { searchData } from '@/api/square/search'
import { searchTips } from '@/api/square/searchTips'
import { getClassify } from '@/api/square/getClassify'
import { getAllArticles } from '@/api/square/getAllArticles'
import { getCover_img } from '@/api/square/getCover_img'
// import { useRouter } from "vue-router"
export default {
    setup() {
        let searchBox = ref(false)
        let searchRes = reactive({
            data: []
        })
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

        let searchStr = ref('')
        const search = () => {
            let str = searchStr.value.trim()
            if (str == '') return
            console.log(str)
            searchData(str).then(res => {
                searchRes.data = res.data.data
                console.log(res.data)
                str = ''
            }).catch(err => {
                console.log(err)
            })
            // searchStr.value.trim()
            console.log(searchStr.value.trim())
        }
        const searchTip = () => {
            
            console.log('inputchuafa')
            let str = searchStr.value.trim()
            if (str == '') {
                searchBox.value = false
                searchRes.data = []
            }
            setTimeout(() => {
                searchTips(str).then(res => {
                    searchRes.data = res.data.data
                    console.log(res.data.data)
                    if(searchRes.data.length !== 0) searchBox.value = true
                }).catch(err => {
                    console.log(err)
                })
            }, 500)

        }
        const changeTip = (data)=>{
            searchStr.value = data
            searchBox.value = false
        }
        let pageNum = 0
        // 文章分类切换函数，切换后拉取对应分类的所有文章
        const tabChange = async (data) => {
            pageNum = 0
            //让tab到对应位置
            activeName.value = data.paneName
            scrollStatus.value = false
            await getCateArticles(data.paneName)



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
        // const blobToBase64 = (data) => {
        //     // console.log(data)
        //     img_loading.value = true
        //     getCover_img(data)
        //         .then(res => {
        //             // let imgBlob = []
        //             // imgBlob = res

        //             //先清理之前的缓存在推入后来得到的
        //             // imgBlobUrl.data = []
        //             // for (let i = 0; i < imgBlob.length; i++) {
        //             //     imgBlobUrl.data.push(URL.createObjectURL(imgBlob[i]))
        //             // }
        //             articleData.data = res
        //             loading.value = false
        //             img_loading.value = false
        //             // console.log('res',articleData.data)
        //         })
        // }
        //获取所有的文章函数
        //data为文章分类
        const getCateArticles = (data) => {
            if (scrollStatus.value) return
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
                if (res.data.status == 1) {
                    scrollStatus.value = true
                    if (articleData.data.length == 0) {
                        // console.log('111111111111',articleData.data)
                        nothing.value = true
                    }
                } else {
                    nothing.value = false
                    getCover_img(res.data.data)
                        .then(res => {
                            // let imgBlob = []
                            // imgBlob = res

                            //先清理之前的缓存在推入后来得到的
                            // imgBlobUrl.data = []
                            // for (let i = 0; i < imgBlob.length; i++) {
                            //     imgBlobUrl.data.push(URL.createObjectURL(imgBlob[i]))
                            // }
                            articleData.data.push(...res)
                            // articleData.data = res
                            loading.value = false
                            img_loading.value = false

                            // console.log('res',articleData.data)
                        })
                }



                loading.value = false
                // console.log(1111111111,getSessionStorage('activeName'))
                setSessionStorage('activeName', data)
                // console.log('getAllArticles', res.data.status, activeName.value, pageNum)
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
        const scrollChange = () => {
            console.log('1111111111111')
            // confirm('1111111111111')
            //文档内容实际高度（包括超出视窗的溢出部分）
            let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            //滚动条滚动距离
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            //窗口可视范围高度
            let clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
            //距离底部还有0.8视窗高度距离的时候触发加载
            let height = 50
            //定义一个加载状态，防止触发多次拉取
            //scrollTop*2是为了在缩放的情况下也更好的获取到加载效果
            if (clientHeight + scrollTop >= scrollHeight - height) {
                if (scrollStatus.value !== true) {
                    // scrollStatus.value = true
                    getCateArticles(activeName.value)
                    // console.log(pageNum + 1, "===加载更多内容……===");
                }
                return


            }
        }
        window.addEventListener('scroll', scrollChange)
        // 销毁监听  (坑：移除监听事件时加true否则销毁不成功)
        onBeforeUnmount(() => {
            window.removeEventListener("scroll", scrollChange)
        })
        return {
            searchBox,
            changeTip,
            searchTip,
            searchStr,
            searchRes,
            search,
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
    .searchBox {
        .search {
            position: relative;
            padding: 25px 0;
            text-align: center;

            .el-input {
                width: 25%;
            }

            .el-button {
                width: 5%;
            }

            .box {
                cursor: pointer;
                margin: 0 auto ; 
                width: 30%;
                text-align: left;
                border-radius: 8px;
                // overflow-y: scroll;
                z-index: 999;
                background-color: rgba($color: #446D99, $alpha: 0.7);
                backdrop-filter: blur(6px);
                position: absolute;
                left: 50%;
                transform: translate(-50%); //水平、垂直都居中,也可以写成下面的方式
            }
        }

    }

    .demo-tabs {

        min-height: 100vh;

        ul {
            padding-top: 20px;
            margin: 0 auto;
            max-width: 41.6rem;

            .nothing {
                line-height: 260px;
            }

            .Pb_li,
            .nothing {
                text-align: center;
                // width: 41.6rem;
                height: 25vh;
                border-radius: 20px;
                margin: 0 10px 30px;
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
                    // width: 90%;
                    height: 80%;
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