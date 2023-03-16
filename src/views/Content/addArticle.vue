<template>
    <div class="container">
        文章编辑页
        <div class="textBox" style="border: 1px solid #ccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <input class="title" placeholder="文章标题"/>
            <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
                :mode="mode" @onCreated="handleCreated" />
        </div>
        {{ valueHtml }}
    </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
    components: { Editor, Toolbar },
    setup() {
        // 编辑器实例，必须用 shallowRef
        const editorRef = shallowRef()

        // 内容 HTML
        const valueHtml = ref('')

        // 模拟 ajax 异步获取内容
        // onMounted(() => {
        //     setTimeout(() => {
        //         valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
        //     }, 1500)
        // })

        const toolbarConfig = {}
        const editorConfig = { placeholder: '请输入内容...' }

        // 组件销毁时，也及时销毁编辑器
        onBeforeUnmount(() => {
            const editor = editorRef.value
            if (editor == null) return
            editor.destroy()
        })

        const handleCreated = (editor) => {
            editorRef.value = editor // 记录 editor 实例，重要！
        }
        
        setTimeout(() => {
        console.log(valueHtml.value)
            }, 4500)
        return {
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
.container{
    .textBox{
        .title{
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