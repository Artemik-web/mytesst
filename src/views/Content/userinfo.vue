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

          <el-button class="psd" @click="pass = true">重置密码</el-button>
        </div>
        <div class="avatarList">
          <el-button @click="viewAddFun">新增文章分类</el-button>
          <div class="formlist" v-if="viewAdd">
            <el-input v-model="addArticinfo.name"></el-input>
            <el-input v-model="addArticinfo.alias"></el-input>
            <el-button @click="addArticclassify">提交</el-button>
          </div>
          <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
            text-color="#fff">
            <el-sub-menu index="1">
              <template #title>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group title="Group One">
                <el-menu-item :key="index" :index="`1-${index + 1}}`" v-for="(item, index) in articClassify.data">
                  <el-tooltip class="box-item" effect="dark" content="Top Left prompts info" placement="top-start">
                    {{ item.name }} <el-button>删除</el-button>
                  </el-tooltip>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </div>
        <el-button style="background-color: #409EFF;margin-left: 10px;color: white;" @click="logout">退出</el-button>
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
    <Dialog_form :formData="formData.userInfo" :viewIf="viewIf" @onSubmit="onSubmit"></Dialog_form>
  </div>
</template>
<script>
import Dialog_form from "../../component/dialog_form.vue";
import { useStore } from "vuex";
import { removeToken } from "../../untils/setToken";
import router from "../../router";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { getUserinfo } from "../../api/getUserinfo";
import { updateUserinfo } from "../../api/updateUserinfo";
import { updateAvatar } from "../../api/updateAvatar";
import { updatePasd } from "../../api/updatePsd";
import { getClassify } from "../../api/getClassify"
import { addClassify } from "../../api/addClassify"
// import Dialog from '@/component/dialog.vue'
export default {
  components: {
    Dialog_form
  },
  setup() {
    let viewIf = ref(false)
    const store = useStore();
    const userData = reactive({})
    //定义reactive类型响应数据来接受getuserInfo()得到的user数据
    let formData = reactive({
      userInfo: {
        // 得到的数据都在传入对象的最外层,b变量名为对应prop
        title: '111',
        items: [
          {
            type: 'Input',
            label: '昵称',
            prop: 'nickname',
            rules: [
              { required: true, message: '昵称必填' }
          ]
          },
          {
            type: 'Input',
            label: '邮箱',
            prop: 'email',
            rules: [{ required: true, message: '邮箱必填' },
            {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ , message: '请输入正确的邮箱账号'}
          ]
          },
        ],
        btn: [
          { funName: 'onSubmit', label: '提交' },
          { funName: 'cancle', label: '取消' }
        ]
      }
    })
    const pass = ref(false)
    //密码更改函数
    const updatePsd = () => {
      // dialogVisible.value = false
      console.log(formData.updatePsd.items[0].data, formData.updatePsd.items[1].data)
      updatePasd({
        oldPwd: formData.updatePsd.items[0].data,
        newPwd: formData.updatePsd.items[1].data
      }).then(res => {
        console.log(res)
      })
    }
    const ruleFrom = ref(null);
    //头像修改函数
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
    //用户信息获取函数
    //页面创建前获取用户信息
    let avatarImg = ref("");
    function getinfo() {
      getUserinfo().then((res) => {
        userData.data = res.data.data;
        avatarImg.value = res.data.data.user_pic || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
        store.state.username = res.data.data.username;
console.log(res.data.data.nickname)
        if (!res.data.data.nickname) {
          viewIf.value = true;
          console.log(1111)
        }else{
          viewIf.value = false;
          console.log(222,viewIf.value)
        }
        
        getArticclassify()
        // console.log(userData)
      });
    }
    getinfo();
    //第一次登陆时更新用户信息
    //更新用户信息函数
    const onSubmit = (data) => {
          updateUserinfo({
            nickname: data.nickname,
            email: data.email,
          })
            .then((res) => {
              getinfo()
              console.log(res)
              
            })
            .catch((error) => {
              return error;
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

    //获取用户文章分类函数
    let articClassify = reactive({
      data: []
    })
    const getArticclassify = () => {
      getClassify().then(res => {
        articClassify.data = res.data.data
        console.log(articClassify)
      })
    }
    //增加文章分类
    let viewAdd = ref(false)
    let addArticinfo = reactive({
      name: '',
      alias: ''
    })
    const viewAddFun = () => {
      viewAdd.value = !(viewAdd.value)
    }
    const addArticclassify = () => {
      addClassify(addArticinfo).then(res => {

        console.log(res)
        getArticclassify()
      })
    }
    return {
      avatarImg,
      articClassify,
      userData,
      formData,
      ruleFrom,
      pass,
      viewIf,
      viewAdd,
      addArticinfo,
      viewAddFun,
      onSubmit,
      updatePsd,
      getArticclassify,
      addArticclassify,
      changeAvatar,
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
}
</style>
