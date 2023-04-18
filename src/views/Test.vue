<template>
    <div class="test">
        <user></user>
        <button @click="testButton">1111111111111</button>
        <el-dialog v-model="test">
            <pbForm ref="testRef" :formData="formData.data"></pbForm>
            <el-button @click="button">按钮</el-button>
        </el-dialog>

    </div>
</template>
<script>
import pbForm from '../component/pb_form.vue'
import user from './Content/userinfo/userinfoComponent/user.vue'
import { reactive, ref } from 'vue'
export default {
    components: {
        pbForm,
        user
    },
    setup() {
        let test = ref(false)
        let formData = reactive({
            data:
            {
                // 得到的数据都在传入对象的最外层,b变量名为对应prop
                items: [
                    {
                        type: 'Input',
                        label: '昵称',
                        prop: 'nickname',
                        rules: [{ required: true, message: '昵称必填' }]
                    },
                    {
                        type: 'Select',
                        label: '性别',
                        prop: 'gender',
                        option: { 0: '女', 1: '男' },
                        rules: [{ required: true, message: '请选择性别' }]
                    },
                    {
                        type: 'Date',
                        label: '生日',
                        prop: 'datestart',
                        rules: [{ required: true, message: '请选择日期' }]
                    },
                    {
                        type: 'Switch',
                        label: '开关1',
                        prop: 'switch1',
                        rules: [{ required: true, message: '请选择开关' }]
                    },
                    {
                        type: 'Checkbox',
                        label: '多选1',
                        prop: 'checkbox1',
                        checkGroup: {
                            0: '唱',
                            1: '跳',
                            2: 'rap',
                            3: '篮球',

                        },
                        rules: [{ required: true, message: '请选择多选1' }]
                    },
                    {
                        type: 'Radio',
                        label: '你的idol单选1',
                        prop: 'radio1',
                        radioGroup: [
                            '蔡徐坤',
                            '菜徐坤',
                            '蔡只因',
                            '只因机'
                        ],
                        rules: [{ required: true, message: '请选择你的idol' }]

                    },
                    {
                        type: 'Textarea',
                        label: '文本1',
                        prop: 'text1',
                        rules: [{ required: true, message: '请输入文本内容' }]

                    },
                ],
            }

        })
        const testRef = ref('testRef')
        // const testRef = ref()
        const button = () => {
            // fun
            console.log(testRef)
            testRef.value.formCheck()

        }
        const testButton = () => {
            test.value = !test.value
        }
        return {
            test,
            testButton,
            formData,
            button,
            testRef
        }
    }
    // "eslint": "^6.7.2",
    // "eslint-plugin-vue": "^7.0.0",
}
</script>