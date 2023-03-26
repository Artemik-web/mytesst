<template>
    <div class="square">
        <div class="content">
            <el-tabs v-loading="loading" v-model="activeName" class="demo-tabs" @tab-click="tabChange">
                <el-tab-pane :key="item.Id" :label="item.name" :name="item.Id" v-for="item in tagData.data">
                    <ul>
                       
                        <li class="nothing" v-if="articleData.data.length == 0">
                            这里是知识的荒漠~~~~~
                        </li>
                        <div class="articleinfo" :key="index" v-for="(item, index) in articleData.data" >
                            <li class="Pb_li" @click="goDetails(item.Id)">
                                <h2>{{ item.title }}</h2>
                                <img class="coverImg" :src="imgBlobUrl.data[index]" alt="个人博客">
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
import { getClassify } from '@/api/getClassify'
import { getAllArticles } from '@/api/getAllArticles'
import { getCover_img } from '@/api/getCover_img'
import {  useRouter } from "vue-router"
export default {
    setup() {
        let router = useRouter()
        let nothing = ref(false)
        let activeName = ref('first')
        let loading = ref(true)
        let tagData = reactive({
            data: []
        })
        let articleData = reactive({
            data: []
        })
        const tabChange = async (activeName) => {
            await getCateArticles(activeName.paneName)
        }
        getClassify().then(res => {
            tagData.data = res.data.data
            activeName.value = tagData.data[0].Id
            loading.value = false
            // console.log(activeName.value)
            getCateArticles(activeName.value)
        }).catch(err => {
            console.log(err)
        })

        let imgBlobUrl = reactive({
            data: []
        })
        //把获取到的文章数据中的封面从blob二进制装化成base64显示在文章封面
        const blobToBase64 = (data) => {
            getCover_img(data)
                .then(res => {
                    let imgBlob = []
                    imgBlob = res
                    // console.log(res)
                    //先清理之前的缓存在推入后来得到的
                    imgBlobUrl.data = []
                    for (let i = 0; i < imgBlob.length; i++) {
                        imgBlobUrl.data.push(URL.createObjectURL(imgBlob[i]))
                        // console.log(imgBlobUrl.data)
                        // const reader = new FileReader()
                        // let fileImg = new File([imgBlob[i]], `${i}`)
                        // // fileImg.push(new File(imgBlob[i], `${i}`))
                        // reader.readAsDataURL(fileImg)
                        // reader.onload = () => {
                        //     imgBlobUrl.data.push(reader.result)

                        // }

                    }
                })
        }
        //获取所有的文章函数
        const getCateArticles = (data) => {
            loading.value = true
            getAllArticles(data).then(res => {
                articleData.data = null
                // console.log(articleData.data)
                if (res.data.data !== []) {
                    articleData.data = res.data.data
                    console.log(articleData.data)
                    blobToBase64(articleData.data)
                } else {
                    nothing.value = true
                }
                console.log(articleData.data)
                loading.value = false
            }).catch(err => {
                console.log(err)
            })
        }
        const goDetails = (articleId)=>{
            router.push({path:`/square/${articleId}`})
        }
        return {
            nothing,
            loading,
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
.content {
    // opacity: 0.5;
    width: 1200px;
    height: 100vh;
    overflow-y: auto;
    margin: 0 auto;
    padding-top: 56px;
    // padding-right: 6px;
    background: rgb(134, 144, 206) linear-gradient(to right, rgba(0, 255, 0, 0), rgba(10, 33, 233, 0.5));

    .demo-tabs {
        // height: 100vh;

        ul {

            // width: 1000px;
            // margin: 0 auto;
            text-align: center;
            .nothing{
                line-height: 260px;
            }
            .Pb_li,.nothing {
                // opacity: 0.9;
                width: 500px;
                height: 260px;
                padding: 5px;
                border-radius: 20px;
                margin: 0 auto 30px;
                background-color: beige;
                scale: 1;
                -webkit-transition: scale 0.5s;

                .coverImg {
                    width: 400px;
                    height: 200px;
                }
            }

            .Pb_li:hover,.nothing:hover {
                scale: 1.05;
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