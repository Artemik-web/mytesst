<template>
    <div class="son">
        <div>{{dialogVisible}}</div>
        <div>{{userData.data}}</div>
        <!-- <h1 class="son">姓名：{{res}}</h1>
        <button @click="btn">单击改变vuex仓库中的数据</button> -->
        <!-- <div>111111</div> -->
        <button @click='logout'>退出</button>
        <el-dialog v-model="dialogVisible" title="第一次登录请您先设置您的账号信息" 
        :close-on-click-modal='false' 
        :show-close="false" 
        :close-on-press-escape="false" >
            <el-form :rules="rules" ref="ruleFrom" :model="formData" label-width="80px" >
                <el-form-item label="昵称：" prop="nickname">
                    <el-input v-model="formData.nickname" required></el-input>
                </el-form-item>
                <!-- <el-form-item label="性别：">
                    <el-radio-group v-model="formData.gender">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <!-- <el-form-item label="生日：">
                    <el-date-picker
                        v-model="formData.borithday"
                        type="date"
                        placeholder="Pick a date"
                    />
                </el-form-item> -->
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                </el-form-item>
                {{userData.data.id}}
            </el-form>
        </el-dialog>
        
    </div>
</template>
<script>
import { useStore } from 'vuex'
import { removeToken } from '../untils/setToken'
import router from '../router'
import { ElMessage } from 'element-plus'
import { reactive, ref, } from 'vue'
import {getUserinfo} from '../api/getUserinfo'
import {updateUserinfo} from '../api/updateUserinfo'
export default({
    setup() {
        //定义reactive类型响应数据来接受getuserInfo()得到的user数据
        let userData = reactive({data:[]})
        let dialogVisible = ref(false)
        let formData = reactive({
            nickname: '',
            // gender:'1',
            // birthday: '',
            email: '',
        })
        const ruleFrom = ref(null)
        let rules = {
            nickname: [{
                required: true,
                message: '请填写昵称'
            }],
            email: [{
                required: true,
                pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: '请填写正确的邮箱'
            }]
        }
        
        //页面创建前获取用户信息
        function getinfo(){
           getUserinfo().then(res =>{
                userData.data = res.data
                if(!res.data.data.nickname){
                    dialogVisible.value = true
                }
                // console.log(userData)
            })
        }
        getinfo()
        // console.log(userData)
        // // //从vuex仓库中取数据
        const store = useStore()
        // const res = computed(()=>{
        //     return store.state.islogin
        // })
            // console.log(store.state.islogin)
        const onSubmit = ()=>{
            ruleFrom.value.validate((valid)=>{
                if(valid){
                    updateUserinfo({
                        id: userData.data.data.id,
                        nickname: formData.nickname,
                        email: formData.email
                    }).then(res=>{
                        userData.data = res.data
                        dialogVisible.value = false
                        console.log(userData.data)

                    }).catch(error=>{
                        return error
                    })
                }
            })
            
        }
        
      //退出登录请求函数
        const logout = ()=>{
            // console.log(res);
            //改变登录状态判断
            store.state.text = false;
            //清除本地记录的token
            removeToken(['PB_token','username','startTime'])
            store.state.islogin = false;
            ElMessage({message: '退出登录',type: 'success'})
            router.push('/home')
        }
        
        console.log(formData)
        return {
            userData,
            formData,
            rules,
            ruleFrom,
            onSubmit,
            dialogVisible,
            logout,
        }
    },
})
</script>
<style scoped>
.son{
    height: 5000px;
    /* background-color: aquamarine; */
}
</style>
