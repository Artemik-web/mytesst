<template>
    <div class="container">
        文章编辑页
        <div class="textBox" style="border: 1px solid #ccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <input class="title" placeholder="文章标题" />
            <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
                :mode="mode" @onCreated="handleCreated" />
        </div>
        <div v-html="valueHtml"></div>
        {{valueHtml }}
    </div>
</template>
<script>
import OSS from 'ali-oss' // 引入阿里oss
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, reactive } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import service from '@/untils/service'
import { useRoute } from 'vue-router'

export default {
    components: { Editor, Toolbar },
    setup() {
        let route = useRoute()
        let client = new OSS({
            region: 'oss-cn-heyuan',//地域（在创建 Bucket 的时候指定的中心位置），这里可能不知道具体地域怎么填其实就是 oss-cn-中心位置 ，例：region:'oss-cn-chengdu'，chengdu则是创建bucket是指定的位置成都。
            accessKeyId: 'LTAI5t5mbhTUuFjz3UCZ7drd', //阿里云产品的通用id
            accessKeySecret: 'vC8SNS6wgpVaYgBzQDNv7rE7rOyiHh',//密钥
            bucket: 'vue3-my-blog-hartbed' //OSS 存储区域名
        })
        // 编辑器实例，必须用 shallowRef
        const editorRef = shallowRef()

        // 内容 HTML
        let valueHtml = ref('')

        // 模拟 ajax 异步获取内容
        // onMounted(() => {
        //     setTimeout(() => {
        //         valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
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
                }
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

        setTimeout(() => {
            console.log(valueHtml.value)
        }, 4500)
        return {
            imgObj,
            client,
            editorRef,
            valueHtml,
            mode: 'default', // 或 'simple'
            toolbarConfig,
            editorConfig,
            handleCreated
        };
    }
}
</script>    
<style lang="scss" scoped>
.container {
    .textBox {
        .title {
            display: block;
            width: 70rem;
            font-size: 7rem;
            text-align: center;
            margin: 0 auto;
            line-height: 60px;
            border-bottom: 2px red solid;
        }
    }
}
</style>