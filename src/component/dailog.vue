<template>
    <el-dialog v-model="dialogVisible">
      <el-form :model="data">
        {{ formData }}
        <el-form-item :key="index" v-for="(item, index) in data">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>
<script>
import { reactive, ref, toRefs } from 'vue';

export default {
    props: {
        formData: Object
    },
    setup(props){
        const dialogVisible = ref(true)
        const data = reactive({
            data:[]
        })
        data.data = toRefs(props.formData)

        return{
            data,
            dialogVisible
        }
    }
}
</script>