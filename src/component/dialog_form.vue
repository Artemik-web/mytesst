<template>
  <div class="dialog">
    <el-dialog v-model="dialogVisible" :title="data.title" :show-close="false" :close-on-press-escape="false">
      <el-form :model="data" ref="ruleForms">

        <!-- input -->
        <div :key="index" v-for="(item, index) in data.items">
          <el-form-item v-if="item.type == 'Input'" :prop="item.prop" :label="item.label" :rules="item.rules">
            <el-input :disabled="item.isDisable" :validate-event="false" v-model="data[item.prop]"></el-input>
          </el-form-item>
        </div>
        <!-- select -->
        <div :key="Index" v-for="(Item, Index) in data.items">
          <el-form-item v-if="Item.type == 'Select'" :prop="Item.prop" :label="Item.label" :rules="Item.rules">
            <el-select v-model="data[Item.prop]" placeholder="Activity zone">
              <el-option :key="index" :value="index" :label="item" v-for="(item, index) in Item.option" />
            </el-select>
          </el-form-item>
        </div>
        <!-- date -->
        <div :key="index" v-for="(item, index) in data.items">
          <el-form-item v-if="item.type == 'Date'" :prop="item.prop" :label="item.label" :rules="item.rules">
            <el-date-picker type="date" v-model="data[item.prop]" placeholder="请选择日期" style="width: 100%" />
          </el-form-item>
        </div>
        <!-- switch -->
        <div :key="index" v-for="(item, index) in data.items">
          <el-form-item v-if="item.type == 'Switch'" :label="item.label" :prop="item.prop" :rules="item.rules">
            <el-switch v-model="data[item.prop]" />
          </el-form-item>
        </div>
      </el-form>
      <!-- checkbox -->
      <div :key="index" v-for="(item, index) in data.items">
        <el-form-item v-if="item.type == 'Checkbox'" :label="item.label" :rules="item.rules">
          <el-checkbox-group v-model="data[item.prop]">
            <el-checkbox :key="index" :label="item" :value="index" v-for="(item, index) in item.checkGroup" />
          </el-checkbox-group>
        </el-form-item>
      </div>
      <!-- radio -->
      <div :key="index" v-for="(item, index) in data.items">
        <el-form-item v-if="item.type == 'Radio'" :label="item.label" :rules="item.rules">
          <el-radio-group v-model="data[item.prop]">
            <el-radio :key="index" :label="item" v-for="(item, index) in item.radioGroup" />
          </el-radio-group>
        </el-form-item>
      </div>
      <!-- textarea -->
      <div :key="index" v-for="(item, index) in data.items">
        <el-form-item v-if="item.type == 'Textarea'" :label="item.label" :prop="item.prop" :rules="item.rules">
          <el-input :validate-event="false" v-model="data[item.prop]" type="textarea" />
        </el-form-item>
      </div>
      <!-- button -->
      <div class="btnBox" style="text-align: center;">
        <div :key="index" v-for="(item, index) in data.btn"
          style="display: inline-block;margin-right: 20px;background-color: blanchedalmond;">
          <el-button @click="onClick(item.funName)">{{ item.label }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//dialog组件数据模板
{/* <Dialog :formData="formData.userInfo" @onSubmit="onSubmit" @cancle="cancle"></Dialog> */ }
// let formData = reactive({
//             userInfo: {
//                 // 得到的数据都在传入对象的最外层,b变量名为对应prop
//                 title: '111',
//                 items: [
//                     {
//                         type: 'Input',
//                         label: '昵称',
//                         prop: 'nickname',
//                         rules: [{ required: true, message: '昵称必填' }]
//                     },
//                     {
//                         type: 'Select',
//                         label: '性别',
//                         prop: 'gender',
//                         option: { 0: '女', 1: '男' },
//                         rules: [{ required: true, message: '请选择性别' }]
//                     },
//                     {
//                         type: 'Date',
//                         label: '生日',
//                         prop: 'datestart',
//                         rules: [{ required: true, message: '请选择日期' }]
//                     },
//                     {
//                         type: 'Switch',
//                         label: '开关1',
//                         prop: 'switch1',
//                         rules: [{ required: true, message: '请选择开关' }]
//                     },
//                     {
//                         type: 'Checkbox',
//                         label: '多选1',
//                         prop: 'checkbox1',
//                         checkGroup: {
//                             0: '唱',
//                             1: '跳',
//                             2: 'rap',
//                             3: '篮球',

//                         },
//                         rules: [{ required: true, message: '请选择多选1' }]
//                     },
//                     {
//                         type: 'Radio',
//                         label: '你的idol单选1',
//                         prop: 'radio1',
//                         radioGroup: [
//                             '蔡徐坤',
//                             '菜徐坤',
//                             '蔡只因',
//                             '只因机'
//                         ],
//                         rules: [{ required: true, message: '请选择你的idol' }]

//                     },
//                     {
//                         type: 'Textarea',
//                         label: '文本1',
//                         prop: 'text1',
//                         rules: [{ required: true, message: '请输入文本内容' }]

//                     },
//                 ],
//                 btn: [
//                     { funName: 'onSubmit', label: '提交' },
//                     { funName: 'cancle', label: '取消' }
//                 ]
//             },

import { reactive, ref } from 'vue';
import { ElMessage } from "element-plus";

export default {
  //接受父组件传值

  props: {
    formData: Object,
    viewIf: Boolean
    // form_rules: Object,
    // refFun: Function
  },
  setup(props, context) {

    const ruleForms = ref(null)
    let data = reactive({})
    data = reactive(props.formData)
    let dialogVisible = ref(props.viewIf)
    const onClick = async (funName) => {
      if (funName !== 'cancle' && funName !== 'close') {
        await ruleForms.value.validate((valid) => {
          if (valid) {
            context.emit(`${funName}`, data)
            ruleForms.value.resetFields()
          } else {
            ElMessage({ message: '数据校验不通过', type: 'error' })
          }
        });
      } else {
        context.emit(`${funName}`, data)
        ruleForms.value.resetFields()
      }


      //父组件函数形式
      // const onSubmit = (data) => {
      //       // console.log( rulesForm.value)
      //       console.log('子组件调用了父组件的onSubmit')
      //       alert('子组件调用了父组件的onSubmit')
      //       console.log(data)
      //   }
      //   const cancle = () => {
      //       console.log('子组件调用了父组件的cancle')
      //       alert('子组件调用了父组件的cancle')
      //   }


      // }
    }
    return {
      data,
      dialogVisible,
      ruleForms,
      onClick
    }
  }
}
</script>
        const onSubmit = (data) => {
            // console.log( rulesForm.value)
            console.log('子组件调用了父组件的onSubmit')
            alert('子组件调用了父组件的onSubmit')
            console.log(data)
        }
        const cancle = () => {
            console.log('子组件调用了父组件的cancle')
            alert('子组件调用了父组件的cancle')
        }