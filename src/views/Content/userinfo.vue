<template>
  <div class="homebox" v-if="userData.data">
    <div class="container">
      <div class="userInfo">
        <ul class="info">
          <li>头像：<el-avatar :src="avatarImg" /></li>
          <li>昵称：{{ userData.data.nickname }}</li>
          <li>id: {{ userData.data.id }}</li>
          <li>邮箱: {{ userData.data.email }}</li>
        </ul>
        <div class="action">

          <!-- 默认上传文件格式为file -->
          <el-upload ref="upload" :auto-upload="false" :show-file-list="false" action="#" :on-change="changeAvatar">
            <el-button type="primary" class="avatar">修改头像</el-button>
          </el-upload>

          <el-button class="psd">重置密码</el-button>
        </div>
        <button @click="logout">退出</button>
      </div>
      <div class="article_box">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="第一次登录请您先设置您的账号信息" :close-on-click-modal="false" :show-close="false"
      :close-on-press-escape="false">
      <el-form :rules="rules" ref="ruleFrom" :model="formData" label-width="80px">
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="formData.userInfo.nickname" required></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.userInfo.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { removeToken } from "../../untils/setToken";
import router from "../../router";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { getUserinfo } from "../../api/getUserinfo";
import { updateUserinfo } from "../../api/updateUserinfo";
import { updateAvatar } from "../../api/updateAvatar";
export default {
  setup() {
    const store = useStore();
    //定义reactive类型响应数据来接受getuserInfo()得到的user数据
    let userData = reactive({ data: [] });
    let dialogVisible = ref(false);
    let formData = reactive({
      userInfo: {
        nickname: "",
        // gender:'1',
        // birthday: '',
        email: "",
      },
      updatePsd: {
        oldPwd: "",
        newPwd: ""
      }

    });
    const ruleFrom = ref(null);
    let rules = {
      nickname: [
        {
          required: true,
          message: "请填写昵称",
        },
      ],
      email: [
        {
          required: true,
          pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          message: "请填写正确的邮箱",
        },
      ],
    };

    //头像文件上传转为base64编码后上传
    const changeAvatar = (file) => {
      const reader = new FileReader();
      //这句将图片转base64
      reader.readAsDataURL(file.raw);
      reader.onload = (e) => {
        // 图片转base64完成后返回reader对象
        console.log(reader.result);
        console.log(e.target.result.url);
        updateAvatar({
          avatar: reader.result,
        }).then((res) => {
          getinfo();
          console.log(res);
        });
      };
      //转base64
      // console.log(reader.result);
    };
    //页面创建前获取用户信息
    let avatarImg = ref("");
    function getinfo() {
      getUserinfo().then((res) => {
        userData.data = res.data.data;
        avatarImg.value = res.data.data.user_pic || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
        store.state.username = res.data.data.username;

        if (!res.data.data.nickname) {
          dialogVisible.value = true;
        }
        // console.log(userData)
      });
    }
    getinfo();
    // console.log(userData)
    // // //从vuex仓库中取数据

    // const res = computed(()=>{
    //     return store.state.islogin
    // })
    // console.log(store.state.islogin)
    //更新用户信息
    const onSubmit = () => {
      ruleFrom.value.validate((valid) => {
        if (valid) {
          updateUserinfo({
            nickname: formData.userInfo.nickname,
            email: formData.userInfo.email,
          })
            .then((res) => {
              userData.data.nickname = formData.userInfo.nickname;
              userData.data.email = formData.userInfo.email;
              dialogVisible.value = false;
              console.log("dialogVisible", res);
            })
            .catch((error) => {
              return error;
            });
        }
      });
    };

    //退出登录请求函数
    const logout = () => {
      // console.log(res);
      //改变登录状态判断
      store.state.text = false;
      //清除本地记录的token
      removeToken(["PB_token", "username", "startTime"]);
      store.state.islogin = false;
      ElMessage({ message: "退出登录", type: "success" });
      router.push("/home");
    };
    // userData.data.token = getToken('PB_token')
    // console.log(userData.data.token);
    return {
      avatarImg,
      changeAvatar,
      userData,
      formData,
      rules,
      ruleFrom,
      onSubmit,
      dialogVisible,
      logout,
    };
  },
};
</script>
<style lang="scss" scoped>
.container {
  .userInfo {
    float: left;
    height: 2000px;
    border-radius: 10px;
    // background: rgba($color: #175ed0, $alpha: 0.5);
    background-color: wheat;

    .info {
      padding-top: 30px;

      li {
        padding-bottom: 15px;
        padding-left: 8px;
      }
    }

    .action {
      display: flex;
      padding: 10px 5px 0;

      .avatar {
        background-color: #409EFF;
        color: white;
      }

      .psd {
        margin-left: 10px;
        color: white;
        background-color: #409EFF;
      }
    }
  }

  .article_box {
    overflow: hidden;

    ul {
      padding-top: 30px;

      li {
        margin: 0 auto 20px;
        width: 600px;
        height: 400px;
        background-color: blueviolet;
      }
    }
  }
}</style>
