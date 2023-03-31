<template>
    <div class="square">
        <div class="square_content">
            <el-tabs v-loading="loading" v-model="activeName" class="demo-tabs" @tab-click="tabChange">
                <el-tab-pane :key="item.Id" :label="item.name" :name="item.Id" v-for="item in tagData.data">
                    <ul>
                        <li class="nothing" v-if="nothing">
                            这里是知识的荒漠~~~~~
                        </li>

                        <div class="articleinfo" :key="index" v-for="(item, index) in articleData.data">
                            <li class="Pb_li" @click="goDetails(item.Id)">
                                <div class="info">
                                    <h2>{{ item.title }}</h2>
                                    <div class="cont"></div>
                                </div>

                                <el-image :class="index % 2 == 0 ? 'coverImgLeft' : 'coverImgRight'" v-loading="img_loading"
                                    :src="imgBlobUrl.data[index]" alt="个人博客" />
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
import { reactive, ref } from 'vue'
import { setSessionStorage, getSessionStorage } from '@/untils/setSession'
import { getClassify } from '@/api/getClassify'
import { getAllArticles } from '@/api/getAllArticles'
import { getCover_img } from '@/api/getCover_img'
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
        const tabChange = async (data) => {
            await getCateArticles(data.paneName)
            activeName.value = data.paneName

        }
        getClassify().then(async res => {
            // loading.value = true
            tagData.data = res.data.data
            activeName.value = Number(getSessionStorage('activeName')) || tagData.data[0].Id
            // loading.value = false
            await getCateArticles(activeName.value)
        }).catch(err => {
            console.log(err)
        })

        let imgBlobUrl = reactive({
            data: []
        })
        //把获取到的文章数据中的封面从blob二进制装化成base64显示在文章封面
        const blobToBase64 = (data) => {
            img_loading.value = true
            getCover_img(data)
                .then(res => {
                    let imgBlob = []
                    imgBlob = res
                    // console.log(res)
                    //先清理之前的缓存在推入后来得到的
                    imgBlobUrl.data = []
                    for (let i = 0; i < imgBlob.length; i++) {
                        imgBlobUrl.data.push(URL.createObjectURL(imgBlob[i]))
                    }
                    img_loading.value = false
                })
        }
        //获取所有的文章函数
        const getCateArticles = (data) => {
            // loading.value = true
            getAllArticles(data).then(async res => {
                articleData.data = null
                // console.log(articleData.data)
                if (res.data.data !== []) {
                    articleData.data = res.data.data
                    // console.log(articleData.data)
                } else {
                    nothing.value = true
                }
                await blobToBase64(articleData.data)
                // console.log(1111111111,getSessionStorage('activeName'))
                setSessionStorage('activeName', data)
            }).catch(err => {
                console.log(err)
            })
        }
        const goDetails = (articleId) => {
            window.open(`/#/square/${articleId}`, '_blank')
            // console.log(router)
        }
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

}</style>