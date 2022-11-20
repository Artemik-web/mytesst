<template>
  <!-- //pc端 -->
  <div v-if="client === 'pc'">
    <div class="common-layout">
      <el-container class="pc_container">
        <el-container class="pc_main">
          <el-header>Header</el-header>
          <el-main>Main</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
        <el-aside class="pc_aside" width="400px">
          Aside
          <!-- 账号密码表单 -->
          <el-form label-width="50px" status-icon>
            <el-form-item class="" label="账号">
              <el-input 
                v-model="username"
                placeholder="请输入账号">
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input
                v-model="password"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-form>
          <!-- 登陆注册按钮 -->
          <div class="action">
            <el-button type="success" @click="register">注册</el-button>
            <el-button type="primary" @click="login">登陆</el-button>
          </div>
          
        </el-aside>
      </el-container>
      <!-- <el-button type="danger" plain>Danger</el-button> -->
    </div>
  </div>
  <!-- //手机端 -->
  <div v-else>
    <div class="login_box">
      <div class="content">
        <h2>PERESONAL-BLOG</h2>
        <div class="input_box">
          <span>账号:</span><el-input v-model="username" max="1" placeholder="请输入用户名" />
        </div>
        <div class="input_box">
          <span>账号:</span><el-input v-model="password" type="password" placeholder="请输入密码" />
        </div>
        <div class="actions">
          <button @click="register" class="register">注册</button>
          <button @click="login" class="login">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed,reactive,toRefs, getCurrentInstance } from 'vue'
import {useStore} from 'vuex'
import {post} from '../api/api' 
export default{
  setup(){
    const a = getCurrentInstance()
    console.log(a)
    const user = reactive({
      username: '',
      password: ''
    })
    const store = useStore()
    const client = computed(()=>{return store.state.client})

    const register = ()=> {
      post('/api/reguser',
        user
      ).then(res=> {
        console.log(res)
      })
    }
      
    const login = ()=> {
      console.log(user.username,user.password)
      post('/api/login',user).then(res=> {
        console.log(res)
      })
    }
  return {
    client,
    ...toRefs(user),
    register,
    login
  }
}
}

</script>
<style lang="less" scoped>
.pc_container {
  background-color: yellow;
  .pc_main {
    height: 100vh;
    background-color: aqua;
    .el-header {
      background-color: beige;
    }
    .el-main {
      background-color: darkblue;
    }
    .el-footer {
      background-color: forestgreen;
    }
  }
  .pc_aside {
    background-color: white;
    .el-form{
      margin: 0 auto;
      width: 320px;
    }
    .action{
      text-align: center;

      // display: flex;
    }
  }
}

.login_box {
      background: url('../assets/image/bg-mobile.jpg') no-repeat;
      background-size: cover;
      width: 100%;
      height: 100vh;
      background-color: #00000060;
      text-align: center;
      border-radius: 10px;
      padding: 80px 50px;
  



    .content{
      span{
        display: inline-block;
        line-height: 50%;
        font-size: 15px;
        color: white;
      }
      
      h2 {
        color: #ffffff90;
        margin-top: 5%;
        margin-bottom: 10%;
      }

      .input-box {
        margin-top: 5%;
      }

      span {
        color: #fff;
      }

      .el-input {
        border: 0;
        width: 60%;
        height: 40px;
        font-size: 15px;
        color: #fff;
        background: transparent;
        // border-bottom: 2px solid #fff;
        padding: 5px 10px;
        outline: none;
        margin-top: 10px;
      }
      .actions{
        button {
        display: inline-block;
        margin: 50px 15px;
        width: 100px;
        height: 30px;
        border-radius: 8px;
        border: 0;
        color: #fff;
        text-align: center;
        line-height: 30px;
        font-size: 15px;
      }
      .register{ 
       background-image: linear-gradient(to left, #7898C7, #425693);
        
      }
      .login{
        background-image: linear-gradient(to right, #7898C7, #425693);

      }

      }
    }


    }

    
</style>
