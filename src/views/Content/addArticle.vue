<template>
    <div class="container">
        <div class="articleInfo">
            <el-form>
                <el-form-item label="文章所属分类:">
                    <el-select v-model="articleInfo.data.cate_id" class="m-2" placeholder="请选择" size="large">
                        <el-option v-for="item in articleClassify.data" :key="item.Id" :label="item.name"
                            :value="item.Id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面:">
                    <el-upload class="avatar-uploader" ref="upload" :limit="1" action="#" :on-change="uploadCover"
                        :on-exceed="handleExceed" :on-success="uploadSucc" :auto-upload="false" :show-file-list="false">
                        <!-- {{ image }} -->
                        <img v-if="true" :src="image" class="avatar" />

                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <button @click="imageDelete">Delete</button>
        <div class="textBox">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <input class="title" placeholder="文章标题" v-model="articleInfo.data.title" />
            <Editor style="height: 500px; overflow-y: hidden;" v-model="articleInfo.data.content"
                :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
        </div>


        <!-- <div class="viewBox">
            <div class="titleView">{{ title }}</div>
            <div class="content">
                <div v-html="valueHtml">

                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import { Plus } from '@element-plus/icons-vue'

import OSS from 'ali-oss' // 引入阿里oss
import '@wangeditor/editor/dist/css/style.css' // 引入 css
// import { Plus } from '@element-plus/icons-vue'
import { onBeforeUnmount, shallowRef, reactive, ref } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import service from '@/untils/service'
import { useRoute } from 'vue-router'
import { getClassify } from '../../api/getClassify'
import { ElMessage,  } from 'element-plus'
export default {
    components: { Editor, Toolbar, Plus },
    setup() {
        let articleInfo = reactive({
            data: {
                cate_id: null,
                title: '',
                content: '',
                cover_img: ''
            }
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
        let route = useRoute()
        //阿里云OSS
        let client = new OSS({
            region: 'oss-cn-heyuan',//地域（在创建 Bucket 的时候指定的中心位置），这里可能不知道具体地域怎么填其实就是 oss-cn-中心位置 ，例：region:'oss-cn-chengdu'，chengdu则是创建bucket是指定的位置成都。
            
            bucket: 'vue3-my-blog-hartbed' //OSS 存储区域名
        })
        const imageDelete = () => {
            client.delete('admin-1-1679275175842')
            console.log('删除')
        }
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
                codeSelectLang: {}
            }

        }
        // 组件销毁时，也及时销毁编辑器
        onBeforeUnmount(() => {
            const editor = editorRef.value
            if (editor == null) return
            editor.destroy()
        })

        const handleCreated = (editor) => {
            editorRef.value = editor // 记录 editor 实例，重要！
        }
        let imgObj = reactive({
            data: [

            ]
        })
        console.log(editorConfig.MENU_CONF['uploadImage'])
        editorConfig.MENU_CONF['uploadImage'] = {
            async customUpload(file, insertFn) {
                const time = new Date().getTime()
                //更改图片名称为用户名加用户id加时间戳防止图床内同名覆盖
                const fileName = `${route.query.username}-${route.query.id}-${time}`
                console.log(file.name)
                console.log(file, insertFn)                 // JS 语法
                const url = `https://image.personalblog.cn/${fileName}`
                const alt = '个人博客'
                const href = `https://image.personalblog.cn/${fileName}`
                client.put(
                    fileName, file
                ).then(res => {
                    console.log(res)
                    //注意在成功后插入不放在client.put内会出现异步insertFn图片地址还未生成
                    insertFn(url, alt, href)
                }).catch(err => {
                    console.log(err)
                })



            }

        }
        // editorConfig.MENU_CONF['codeSelectLang'] = {
        //     // 代码语言
        //     codeLangs: [
        //         { text: 'CSS', value: 'css' },
        //         { text: 'HTML', value: 'html' },
        //         { text: 'XML', value: 'xml' },
        //         // 其他
        //     ]
        // }

        //文章信息相关
        //封面上传函数
        const dialogImageUrl = ref('')
        const dialogVisible = ref(false)
        const disabled = ref(false)

        let image = ref('')
        const uploadCover = (file,UploadFiles) => {
            console.log(UploadFiles)
            let fileBlob = file.raw ? new Blob([file.raw], { type: 'image/jpeg' }):new Blob([file], { type: 'image/jpeg' })
            let newFile = new File([fileBlob], '')
            console.log(newFile)
            articleInfo.data.cover_img = fileBlob
            let reader = new FileReader();
            //这句将图片转base64//异步转化过程
            // reader.readAsDataURL(file.raw);
            reader.readAsDataURL(newFile);
            console.log(reader)
            reader.onload = () => {
                // 图片转base64完成后返回reader对象
                // console.log(reader.result);//base64
                image.value = reader.result

            }
            console.log(articleInfo)
        }

        // const upload = ref();
        const handleExceed = (file,files) => {
            console.log(file,files[0])
            files[0] = file[0]
            uploadCover(file,files)

        }
        const uploadSucc = (uploadFile)=>{
            console.log(uploadFile)
        }
        return {
            dialogImageUrl,
            uploadSucc,
            handleExceed,
            dialogVisible,
            disabled,
            image,
            imageDelete,
            uploadCover,
            articleInfo,
            imgObj,
            client,
            editorRef,
            // valueHtml,
            mode: 'default', // 或 'simple'
            toolbarConfig,
            editorConfig,
            articleClassify,
            handleCreated
        };
    }
}
</script>    

<style lang="scss" scoped>
.avatar-uploader .avatar {
    height: 400px;
    width: 600px;
    background-color: red;
    display: block;
    border: 2px blue solid;
}

.container {
    background: white;

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
            width: 596px;
        }

        .content {
            height: 100%;
            padding-top: 9rem;
            max-height: 320px;
        }
    }

    ::v-deep {

        img,
        p,
        table,
        span {
            max-width: 100%;
        }

        blockquote {
            border-left: 8px solid #d0e5f2;
            padding: 10px 10px;
            margin: 10px 0;
            background-color: #f1f1f1;
        }

        code {

            font-family: monospace;
            background-color: #eee;
            padding: 3px;
            border-radius: 3px;
        }

        pre>code {
            ::-webkit-scrollbar {
                height: 20px;
                width: 20px !important;
            }

            display: block;
            padding: 10px;
        }

        table {
            border-collapse: collapse;
            overflow-x: auto;
            display: -webkit-box;
            -webkit-overflow-scrolling: touch;
        }

        td,
        th {
            border: 1px solid #ccc;
            min-width: 50px;
            height: 20px;
        }

        th {
            background-color: #f1f1f1;
        }

        ul,
        ol {
            padding-left: 20px;
        }

        input[type="checkbox"] {
            margin-right: 5px;
        }

        ul,
        ol {
            list-style: revert;
        }
    }
}
</style>
