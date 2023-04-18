<template>
    <div class="container">
        <div class="textBox">
            <Toolbar style="border-bottom: 1px solid #ccc; z-index: 1;" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <input class="title" autofocus placeholder="文章标题" v-model="articleInfo.data.title" required />
            <Editor style="height: 41.6rem; overflow-y: hidden; z-index: 1;" v-model="articleInfo.data.content"
                :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
        </div>
        <div class="articleInfo">
            <el-form ref="articleRef" :model="articleInfo.data">
                <el-form-item label="文章所属分类:" prop="cate_id" :rules="[{ required: true, message: '请选择文章所属分类' }]">
                    <el-select v-model="articleInfo.data.cate_id" class="m-2" placeholder="请选择" size="large">
                        <el-option v-for="item in articleClassify.data" :key="item.Id" :label="item.name"
                            :value="item.Id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面:" required>
                    <el-upload class="avatar-uploader" accept="image/jpg,image/jpeg,image/png" ref="upload" action="#"
                        :on-change="uploadCover" :auto-upload="false" :show-file-list="false">
                        <!-- {{ image }} -->
                        <img v-if="true" :src="image" class="avatar" />

                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>



        <!-- <div class="viewBox">
            <div class="titleView">{{ title }}</div>
            <div class="content">
                <div v-html="valueHtml">

                </div>
            </div>
        </div> -->
        <div>
            <div v-if="viewUpdate" @click="editorUpdate">
                <el-button>确认更新</el-button>
            </div>
            <div v-else>
                <el-button @click="release(1)">发布</el-button>
                <el-button @click="release(0)">存草稿</el-button>
            </div>
        </div>


    </div>
</template>
<script>
import { Plus } from '@element-plus/icons-vue'
import OSS from 'ali-oss' // 引入阿里oss
import '@wangeditor/editor/dist/css/style.css' // 引入 css
// import { Plus } from '@element-plus/icons-vue'
import { onBeforeUnmount, shallowRef, reactive, ref, watch, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import service from '@/untils/service'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { getClassify } from '@/api/square/getClassify'
import { getArticleById } from '@/api/articleDetails/getArticleById'
import { getCover_img } from '@/api/square/getCover_img'
import { addArticle } from '@/api/userinfo/addArticle/addArticle'
import { updateArticle } from '@/api/userinfo/addArticle/updateArticle'
import { ElMessage, } from 'element-plus'
export default {
    components: { Editor, Toolbar, Plus },
    setup() {
        let articleInfo = reactive({
            data: {
                // Id: 1,
                cate_id: null,
                title: '',
                content: '',
                state: null,
                cover_img: {}
            }
        })
        let image = ref('')
        let route = useRoute()
        let viewUpdate = route.query.Id
        // console.log(1111111,route)
        //判断进入该路由是否携带文章id，如果携带文章id，那么就是文章更新页面，所有的变量由文章id获取的文章内容赋予
        if (route.query.Id && route.path == `/${route.params.username}/updateArticle`) {
            console.log(111111, route.query)
            getArticleById(route.query.Id).then(res => {
                articleInfo.data = { ...res.data.data }
                console.log('原', res.data.data)
                getCover_img([articleInfo.data]).then(res => {
                    console.log('str', res)
                    // articleInfo.data.cover_img = res[0].cover_img
                    image.value = res[0].cover_img
                })
                console.log(articleInfo.data)
            }).catch(err => {
                console.log(err)
            })
        }
        //阿里云OSS
        let client = new OSS({
            region: 'oss-cn-heyuan',//地域（在创建 Bucket 的时候指定的中心位置），这里可能不知道具体地域怎么填其实就是 oss-cn-中心位置 ，例：region:'oss-cn-chengdu'，chengdu则是创建bucket是指定的位置成都。
            

            bucket: 'vue3-my-blog-hartbed' //OSS 存储区域名
        })
        //定义一个用来监听文章是否已经发布或者存入草稿的变量来决定如何处理上传文章需要和不需要的图片
        let imgUseful = ref(null)
        //监听路由状态,如果刷新或者未更改imgUseful状态的情况下离开则所有上传的图片从图床删除(点击发布和存草稿可改变imguseful状态)
        // console.log(imgUseful, route)
        //1.第一种情况点了发布或草稿 那么删除未使用的，即noUse
        //2.第二种情况没有发布或者草稿页面刷新或者离开了，那么应该删除所有上传的图片
        // 当参数更改时获取用户信息 
        let imgObj = []
        const imageDelete = (data) => {
            for (let i = 0; i < data.length; i++) {
                client.delete(data[i])
            }
        }
        watch(
            imgUseful,
            async val => {
                console.log('监听了')
                let imgpath = []
                const num = document.getElementsByTagName('img').length - 1
                for (let i = 0; i < num; i++) {
                    //提交前获取编辑器内所使用到的图片，接下来需要删除上传了但是没使用的图片
                    imgpath.push(document.getElementsByTagName('img')[i].src.replace('https://image.personalblog.cn/', ''))

                }
                if (imgUseful.value == true) {

                    let noUse = imgObj.filter((item) => {
                        return imgpath.includes(item) == false
                    })
                    //如果有未使用的图片就把未使用的从图床中删除
                    console.log(imgObj)
                    console.log(imgpath)
                    console.log(noUse)
                    if (noUse) imageDelete(noUse)
                    return val
                } else {
                    //如果
                    console.log('删除所有图片', imgpath)
                    imageDelete(imgpath)
                }

            }
        )
        const leave = (e) => {
            if (e) {
                console.log('请求')
                return '提示'
            } else {
                window.onbeforeunload = null
            }
        }
        onMounted(() => {
            //刷新或关闭时触发,提示用户离开不保存数据
            window.onbeforeunload = leave
        })
        const articleClassify = reactive({
            data: []
        })
        //获取文章分类
        getClassify().then(res => {
            articleClassify.data = res.data.data
        }).catch(err => {
            ElMessage({ message: err.data.message, type: 'error' })
            return null
        })

        // 编辑器实例，必须用 shallowRef
        const editorRef = shallowRef()

        //编辑器内容 HTML
        // let valueHtml = ref('')
        //草稿显示
        // 模拟 ajax 异步获取内容
        // onMounted(() => {
        //     setTimeout(() => {
        //         valueHtml.value = html
        //     }, 1500)
        // })

        const toolbarConfig = {}
        const editorConfig = {
            placeholder: '请输入内容...',
            MENU_CONF: {
                uploadImage: {
                    // service: 'vue3-my-blog-hartbed.oss-cn-heyuan.aliyuncs.com',
                    // 最多可上传几个文件，默认为 100
                    maxNumberOfFiles: 10,
                    base64LimitSize: 5 * 1024 * 1024,
                    // 超时时间，默认为 10 秒
                    timeout: 5 * 1000, // 5 秒
                    // 单个文件上传成功之后
                    // 上传之前触发
                    onBeforeUpload(file) {
                        // file 选中的文件，格式如 { key: file }
                        console.log(file)
                        return file

                        // 可以 return
                        // 1. return file 或者 new 一个 file ，接下来将上传
                        // 2. return false ，不上传这个 file
                    },
                    onSuccess(file, res) {
                        console.log(`${file.name} 上传成功`, res)
                    },
                },
                uploadVideo: {
                    // server: '/api/upload',
                    // fieldName: `${route.params.username}-${new Date().getTime()}`,

                    // 单个文件的最大体积限制，默认为 10M
                    maxFileSize: 500 * 1024 * 1024, // 5M
                },
                codeSelectLang: {}
            }

        }
        // 组件销毁时，也及时销毁编辑器
        onBeforeUnmount(() => {
            // 离开页面清除onbeforeunload事件 不然其他页面也会触发
            window.onbeforeunload = null

        })
        const editorDestroy = () => {
            const editor = editorRef.value;
            if (editor == null) return;
            editor.destroy()

        };
        const handleCreated = (editor) => {
            editor.blur()
            editorRef.value = editor // 记录 editor 实例，重要！
        }
        editorConfig.MENU_CONF['uploadImage'] = {
            async customUpload(file, insertFn) {
                const time = new Date().getTime()
                //更改图片名称为用户名加用户id加时间戳防止图床内同名覆盖
                const fileName = `${route.params.username}-${time}`
                const url = `https://image.personalblog.cn/${fileName}`
                const alt = '个人博客'
                const href = `https://image.personalblog.cn/${fileName}`
                client.put(
                    fileName, file
                ).then(res => {
                    imgObj.push(fileName)
                    //注意在成功后插入不放在client.put内会出现异步insertFn图片地址还未生成
                    insertFn(url, alt, href)
                    return res
                }).catch(err => {
                    console.log(err)
                })



            }

        }
        editorConfig.MENU_CONF['uploadVideo'] = {
            // 自定义上传
            async customUpload(file, insertFn) {
                console.log(file, insertFn)                // JS 语法
                // file 即选中的文件
                // 自己实现上传，并得到视频 url poster
                // 最后插入视频
                const fileName = `${route.params.username}-${new Date().getTime()}`
                client.put(
                    fileName, file
                ).then(res => {
                    // imgObj.push(fileName)
                    //注意在成功后插入不放在client.put内会出现异步insertFn图片地址还未生成
                    const url = `https://image.personalblog.cn/${fileName}`
                    insertFn(url)
                    console.log(res)
                    return res
                }).catch(err => {
                    console.log(err)
                })
                // insertFn(url, poster)
            }
        }
        //文章信息相关
        //封面上传函数
        const uploadCover = (file, fileList) => {
            //清空之前的文件上传框无需设置limit否则不调用onchange函数
            if (fileList.length > 1) {
                fileList.splice(0, 1);
            }
            if (file.raw.type !== "image/jpg" && file.raw.type !== "image/jpeg" && file.raw.type !== "image/png") {
                ElMessage({ message: '仅支持上传jpg/jpeg/png格式文件', type: 'error' })
            } else {
                console.log(fileList)
                let fileBlob = new Blob([file.raw], { type: 'image/jpeg' })
                let newFile = new File([fileBlob], `${file.name}`)
                let reader = new FileReader();
                //这句将图片转base64//异步转化过程
                // reader.readAsDataURL(file.raw);
                reader.readAsDataURL(newFile);
                reader.onload = () => {
                    // 图片转base64完成后返回reader对象
                    image.value = reader.result
                    articleInfo.data.cover_img = fileBlob
                }

            }

        }
        let articleRef = ref(null)
        const release = async (status) => {
            articleInfo.data.state = status ? '已发布' : '草稿'
            await articleRef.value.validate((valid) => {

                if (valid && image.value && articleInfo.data.title) {
                    addArticle(articleInfo.data).then(res => {
                        imgUseful.value = true
                        console.log(imgUseful.value)
                        ElMessage({ message: res.data.message, type: 'success' })
                        //编辑器销毁
                        editorDestroy()
                        router.push({
                            path: `/${route.query.username}/addArticle/addSuccess`,query:{articleId: res.data.articleId}
                        })
                    }).catch(err => {
                        console.log('报错', err)
                        ElMessage({ message: err.message, type: 'error' })
                    })
                } else {
                    if (!valid) {
                        ElMessage({ message: '请填写文章标题', type: 'error' })
                    }
                    if (!image.value) {
                        ElMessage({ message: '请选择文章封面', type: 'error' })
                    }
                    if (!articleInfo.data.title) {
                        ElMessage({ message: '请填写文章标题', type: 'error' })
                    }

                }
            })

        }
        console.log(route)
        const editorUpdate = () => {
            console.log(articleInfo.data)
            updateArticle(articleInfo.data).then(res => {
                console.log(articleInfo.data,route)
                ElMessage({message: `${res.data.message}`, type: 'success'})
                //编辑器销毁
                editorDestroy()
                let path_username = route.params.username
                
                router.push({
                    path: `/${path_username}/addArticle/addSuccess`,query:{articleId: articleInfo.data.Id}
                })
                
            }).catch(err => {
                console.log(err)
            })
        }
        return {
            image,
            viewUpdate,
            imageDelete,
            uploadCover,
            release,
            articleInfo,
            imgObj,
            client,
            editorRef,
            // valueHtml,
            mode: 'default', // 或 'simple'
            articleRef,
            toolbarConfig,
            editorConfig,
            articleClassify,
            handleCreated,
            editorUpdate
        };
    }
}
</script>    

<style lang="scss" scoped>
.avatar-uploader .avatar {
    height: 31.3rem;
    width: 50rem;
    background-color: rgb(124, 218, 233);
    display: block;
    border: 2px blue solid;
}

.container {
    // background: white;

    // display: flex;
    .avatar-uploader {
        display: block;
    }

    .textBox {
        // width: 50%;
        width: 100%;
        border: 1px solid #ccc;

        .title {
            display: block;
            width: 100%;
            font-size: 7rem;
            text-align: center;
            margin: 0 auto;
            line-height: 60px;
            border-bottom: 2px red solid;
        }
    }

    .viewBox {
        width: 50%;
        word-wrap: break-word;
        word-break: break-all;
        overflow: auto;
        border: 2px red solid;

        .titleView {
            height: 8rem;
            background-color: azure;
            text-align: center;
            line-height: 8rem;
            font-size: 5rem;
            position: fixed;
            width: 49.6rem;
        }

        .content {
            height: 100%;
            padding-top: 9rem;
            max-height: 320px;
        }
    }

    // ::v-deep {

    //     img,
    //     p,
    //     table,
    //     span {
    //         max-width: 100%;
    //     }

    //     blockquote {
    //         border-left: 8px solid #d0e5f2;
    //         padding: 10px 10px;
    //         margin: 10px 0;
    //         background-color: #f1f1f1;
    //     }

    //     code {

    //         font-family: monospace;
    //         background-color: #eee;
    //         padding: 3px;
    //         border-radius: 3px;
    //     }

    //     pre>code {
    //         ::-webkit-scrollbar {
    //             height: 20px;
    //             width: 20px !important;
    //         }

    //         display: block;
    //         padding: 10px;
    //     }

    //     table {
    //         border-collapse: collapse;
    //         overflow-x: auto;
    //         display: -webkit-box;
    //         -webkit-overflow-scrolling: touch;
    //     }

    //     td,
    //     th {
    //         border: 1px solid #ccc;
    //         min-width: 50px;
    //         height: 20px;
    //     }

    //     th {
    //         background-color: #f1f1f1;
    //     }

    //     ul,
    //     ol {
    //         padding-left: 20px;
    //     }

    //     // input[type="checkbox"] {
    //     //     margin-right: 5px;
    //     // }

    //     ul,
    //     ol {
    //         list-style: revert;
    //     }
    // }
}
</style>
