<template>
    <div class="pb_form">
        <el-form :model="Data" ref="ruleForms">
            <!-- {{ fromdata }} -->
            <!-- input -->
            <div :key="index" v-for="(item, index) in Data.items">

                <el-form-item v-if="item.type == 'Input'" :prop="item.prop" :label="item.label" :rules="item.rules">
                    <!-- Data[item.prop] 是不存在的 通过这样可以在输入时创建这个变量数据 -->
                    <el-input :disabled="item.isDisable" :validate-event="false" v-model="Data[item.prop]"></el-input>
                </el-form-item>
            </div>
            <!-- select -->
            <div :key="Index" v-for="(Item, Index) in Data.items">
                <el-form-item v-if="Item.type == 'Select'" :prop="Item.prop" :label="Item.label" :rules="Item.rules">
                    <el-select v-model="Data[Item.prop]" placeholder="Activity zone">
                        <el-option :key="index" :value="index" :label="item" v-for="(item, index) in Item.option" />
                    </el-select>
                </el-form-item>
            </div>
            <!-- date -->
            <div :key="index" v-for="(item, index) in Data.items">
                <el-form-item v-if="item.type == 'Date'" :prop="item.prop" :label="item.label" :rules="item.rules">
                    <el-date-picker type="date" v-model="Data[item.prop]" placeholder="请选择日期" style="width: 100%" />
                </el-form-item>
            </div>
            <!-- switch -->
            <div :key="index" v-for="(item, index) in Data.items">
                <el-form-item v-if="item.type == 'Switch'" :label="item.label" :prop="item.prop" :rules="item.rules">
                    <el-switch v-model="Data[item.prop]" />
                </el-form-item>
            </div>

            <!-- checkbox -->
            <div :key="index" v-for="(item, index) in Data.items">
                <el-form-item v-if="item.type == 'Checkbox'" :label="item.label" :prop="item.prop" :rules="item.rules">
                    <el-checkbox-group v-model="Data[item.prop]">
                        <el-checkbox :key="index" :label="item" :value="index" v-for="(item, index) in item.checkGroup" />
                    </el-checkbox-group>
                </el-form-item>
            </div>
            <!-- radio -->
            <div :key="index" v-for="(item, index) in Data.items">
                <el-form-item v-if="item.type == 'Radio'" :label="item.label" :prop="item.prop" :rules="item.rules"
                    required>
                    <el-radio-group v-model="Data[item.prop]">
                        <el-radio :key="index" :label="item" v-for="(item, index) in item.radioGroup" />
                    </el-radio-group>
                </el-form-item>
            </div>
            <!-- textarea -->
            <div :key="index" v-for="(item, index) in Data.items">
                <el-form-item v-if="item.type == 'Textarea'" :label="item.label" :prop="item.prop" :rules="item.rules">
                    <el-input :validate-event="false" v-model="Data[item.prop]" type="textarea" />
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import { reactive, ref } from 'vue';
import { ElMessage } from "element-plus";
export default {
    props: {
        formData: Object
    },
    setup(props) {

        // console.log(context)
        let Data = reactive({
            ...props.formData
        })
        const ruleForms = ref(null)
        //校验表单
        const formClear = () => {
            //清空表单数据
            ruleForms.value.resetFields()
        }
        const formCheck = (fun) => {

            console.log(ruleForms)

            ruleForms.value.validate((valid) => {
                if (valid) {
                    fun()
                } else {
                    ElMessage({ message: '数据校验不通过', type: 'error' })
                }
            });
        }
        //暴露state和play方法
        // defineExpose({
        //     fun
        // });
        return {
            Data,
            formCheck,
            formClear,
            ruleForms
        }

    }

}
</script>