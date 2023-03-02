<template>
    <div class="son">
        <div>{{dialogVisible}}</div>
        <div>{{userData.data}}</div>
        <!-- <h1 class="son">姓名：{{res}}</h1>
        <button @click="btn">单击改变vuex仓库中的数据</button> -->
        <!-- <div>111111</div> -->
        <button @click='logout'>退出</button>
        <el-dialog v-model="dialogVisible" title="第一次登录请您先设置您的账号信息" :close-on-click-modal='false' :show-close="false" :close-on-press-escape="false" >
            <el-button type="primary" @click="dialogVisible = false">取消</el-button>
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
export default({
    setup() {
        let userData = reactive({data:[]})
        let dialogVisible = ref(false)
        //页面创建前获取用户信息
        function getinfo(){
           getUserinfo().then(res =>{
                userData.data = res.data
                if(!res.data.data.nickname){
                    dialogVisible.value = true
                    console.log(res.data.data.nickname,dialogVisible)
                }
                // console.log(userData)
            })
        }
        getinfo()
        console.log(userData)
        // // //从vuex仓库中取数据
        const store = useStore()
        // const res = computed(()=>{
        //     return store.state.islogin
        // })
            // console.log(store.state.islogin)
        
      //退出登录请求函数
        const logout = (res)=>{
            console.log(res);
            //改变登录状态判断
            store.state.text = false;
            //清除本地记录的token
            removeToken(['PB_token','username','startTime'])
            store.state.islogin = false;
            ElMessage({message: '退出登录',type: 'success'})
            router.push('/home')
        }
        

        return {
            userData,
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
