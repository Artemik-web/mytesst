<template>
  <div class="homebox" v-if="userData.data">
    <div class="container">
      <div class="userInfo">
        <ul class="info">
          <li>头像：<img class="avatar" :src="avatarImg" /></li>
          <li>昵称：{{ userData.data.nickname }}</li>
          <li>id: {{ userData.data.id }}</li>
          <li>邮箱: {{ userData.data.email }}</li>
        </ul>
        <div class="action">

          <!-- 默认上传文件格式为file -->
          <el-upload ref="upload" :auto-upload="false" :show-file-list="false" action="#" :on-change="changeAvatar">
            <el-button type="primary" class="avatar">修改头像</el-button>
          </el-upload>

          <el-button class="psd" @click="viewPsdClick">重置密码</el-button>
        </div>
        <div class="avatarList">
          <el-button @click="viewAddFun">新增文章分类</el-button>
          <div class="formlist" v-if="viewAdd">
            <el-input style="width: 16.6rem;display: block;" v-model="addArticinfo.name"></el-input>
            <el-input style="width: 16.6rem;display: block;" v-model="addArticinfo.alias"></el-input>
            <el-button @click="addArticclassify">提交</el-button>
          </div>
          <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
            text-color="#fff">
            <el-sub-menu index="1">
              <template #title>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group title="Group One">
                <div :key="index" v-for="(item, index) in articClassify.data" style="padding: 0 10px">
                  <el-menu-item style="display:inline-block; width: 16.6rem;" :index="`1-${index + 1}}`">
                    {{ item.name }}
                  </el-menu-item>
                  <el-button style="display:inline-block" @click="viewArticCate(item)">查看</el-button>
                  <el-button style="display:inline-block" @click="deleteArticCate(item.Id)">删除</el-button>
                </div>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </div>
        <el-button style="background-color: #409EFF;margin-left: 10px;color: white;" @click="logout">退出</el-button>
      </div>
      <div class="article_box">
        <div class="classify">
          <div class="release" @click="getUserArticle(data = 1)">已发布</div>
          <div class="draft" @click="getUserArticle(data = 0)">草稿箱</div>
        </div>
        <el-button @click="jumpToAdd">写文章</el-button>
        <!-- 分割 -->
        <ul class="userArticle">
          <li class="nothing" v-if="nothing">
            这里是知识的荒漠~~~~~
          </li>

          <div class="articleinfo">
            <li class="Pb_li" @click="goDetails(item.Id)" :key="index" v-for="(item, index) in userArticle.data">
              <div class="info">
                <h2>{{ item.title }}</h2>
                <div class="cont"></div>
              </div>
              <el-image alt="个人博客" />
              <div class="editor" @click.stop @click="updateArticle(item.Id)" >编辑</div>
              <div class="delete" @click.stop @click="deleteArticle(item.Id, index)">删除</div>
            </li>
            <!-- <div class="end" v-if="(nothing !== true)">
              拼命加载中.......
            </div> -->
            <div class="end" v-if="(nothing !== true)">
              已经到底了~~~
            </div>
          </div>

        </ul>
        <!-- 分割 -->

      </div>
    </div>
    <el-dialog :show-close="false" v-model="viewArticCateData" title="当前文章分类信息">
      <el-form :model="currentData.data" ref="articRefvalid">
        <el-form-item label="文章分类名" prop="name" :rules="[{ required: true, message: '不能为空' }]">
          <el-input v-model="currentData.data.name"></el-input>
        </el-form-item>
        <el-form-item label="文章分类ID" prop="Id" :rules="[{ required: true, message: '不能为空' }]">
          <el-input :disabled="true" v-model="currentData.data.Id"></el-input>
        </el-form-item>
        <el-form-item label="文章分类代码" prop="alias" :rules="[{ required: true, message: '不能为空' }]">
          <el-input v-model="currentData.data.alias"></el-input>
        </el-form-item>
        <el-form-item label="是否被删除" prop="is_delete" :rules="[{ required: true, message: '不能为空' }]">
          <el-input :disabled="true" v-model="currentData.data.is_delete"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="updateArticCate">提交</el-button>
    </el-dialog>
    <Dialog_form v-if="viewIf" :formData="formData.userInfo" :viewIf="viewIf" @onSubmit="onSubmit"></Dialog_form>
    <Dialog_form v-if="viewPsd" :formData="formData.updatePassword" :viewIf="viewPsd" @updatePsd="updatePsd"
      @cancle="cancle"></Dialog_form>
  </div>
</template>
<script>
import Dialog_form from "@/component/dialog_form.vue";
import { useStore } from "vuex";
import { removeToken } from "@/untils/setToken";
import { deleteSessionStorage } from "@/untils/setSession";
import router from "@/router";
import { ElMessage } from "element-plus";
import { reactive, ref , onBeforeUnmount} from "vue";
import { getUserinfo } from "@/api/userinfo/getUserinfo";
import { updateUserinfo } from "@/api/userinfo/updateUserinfo";
import { updateAvatar } from "@/api/userinfo/updateAvatar";
import { updatePasd } from "@/api/userinfo/updatePsd";
import { getClassify } from "@/api/square/getClassify"
import { addClassify } from "@/api/userinfo/addClassify"
import { deleteCate } from "@/api/userinfo/deleteCate"
import { uplateArticCate } from "@/api/userinfo/uplateArticCate"
import { getUserArticleById } from "@/api/userinfo/getUserArticle"
import { deleteArticleById } from "@/api/userinfo/deleteArticleById"
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
        title: '第一次登陆请先填写个人信息',
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
            { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱账号' }
            ]
          },
        ],
        btn: [
          { funName: 'onSubmit', label: '提交' },
        ]
      },
      updatePassword: {
        title: '密码修改',
        items: [
          {
            type: 'Input',
            label: '原密码',
            prop: 'oldPwd',
            rules: [
              { required: true, message: '请输入原密码' }
            ]
          },
          {
            type: 'Input',
            label: '新密码',
            prop: 'newPwd',
            rules: [
              { required: true, message: '请输入新密码' }
            ]
          },
        ],
        btn: [
          { funName: 'updatePsd', label: '提交' },
          { funName: 'cancle', label: '取消' }
        ]
      },

    })
    //密码更改函数
    let viewPsd = ref(false)
    const viewPsdClick = () => {
      viewPsd.value = true
    }
    const updatePsd = (data) => {
      updatePasd({
        oldPwd: data.oldPwd,
        newPwd: data.newPwd
      }).then(res => {
        if (!res.data.status) {
          ElMessage({ message: '密码修改成功!', type: 'success' })
          viewPsd.value = false
          console.log(res)
        } else {
          ElMessage({ message: res.data.message, type: 'error' })
        }

      })
    }
    const cancle = () => {
      viewPsd.value = false
      viewIf.value = false
    }

    const ruleFrom = ref(null);

    //头像修改函数
    let avatarImg = ref("");
    //头像文件上传转为base64编码后上传
    const changeAvatar = (file) => {
      const reader = new FileReader();
      //这句将图片转base64
      reader.readAsDataURL(file.raw);
      reader.onload = () => {
        // 图片转base64完成后返回reader对象
        // console.log(reader.result);
        // console.log(e.target.result.url);
        updateAvatar({
          avatar: reader.result,
        }).then((res) => {
          avatarImg.value = reader.result;
          console.log(res, reader.result);
        });

      };

      //转base64
      // console.log(reader.result);
    };
    //用户信息获取函数
    //页面创建前获取用户信息

    function getinfo() {
      getUserinfo().then((res) => {
        userData.data = res.data.data;
        avatarImg.value = res.data.data.user_pic || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
        store.state.username = res.data.data.username;
        console.log(res.data.data.nickname)
        if (!res.data.data.nickname) {
          viewIf.value = true;
        } else {
          viewIf.value = false;
        }

        getArticclassify()
        getUserArticle()
      }).catch(err => {
        console.log(err)
      })
        ;
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
      deleteSessionStorage("activeName")
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
        // console.log(articClassify)
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
        getArticclassify()
        return res
      })
    }
    //根据id删除文章分类
    const deleteArticCate = (data) => {
      deleteCate({
        id: data
      }).then(res => {
        getArticclassify()
        return res
      }).catch(err => {
        return err
      })
    }
    //更新文章分类名称&&查看文章分类信息
    let viewArticCateData = ref(false)
    let currentData = reactive({
      data: []
    })
    const articRefvalid = ref(null)
    const oldData = reactive({
      data: []
    })
    const viewArticCate = (data) => {
      currentData.data = data
      console.log(currentData)
      oldData.data = {
        name: currentData.data.name,
        alias: currentData.data.alias
      }
      viewArticCateData.value = true
      console.log(viewArticCateData.value)
    }
    const updateArticCate = () => {
      articRefvalid.value.validate((valid) => {
        if (valid && oldData.data.name !== currentData.data.name || oldData.data.alias !== currentData.data.alias) {
          uplateArticCate({
            Id: currentData.data.Id,
            name: currentData.data.name,
            alias: currentData.data.alias,
          }).then(res => {
            if (res.data.status !== 0) {
              ElMessage({ message: res.data.message, type: 'error' })
            } else {
              console.log(oldData)
              ElMessage({ message: res.data.message, type: 'success' })
              viewArticCateData.value = false
            }
          })
        } else {
          ElMessage({ message: '数据没有发生更改,无需提交', type: 'error' })
        }
      })
    }
    const jumpToAdd = () => {
      console.log(userData)
      router.push({
        path: `/${userData.data.username}/addArticle`
      })
    }

    let userArticle = reactive({
      data: []
    })
    let nothing = ref(false)
    let pageNum = 0
    let state = ''
    const getUserArticle = (data = 1) => {
      //默认为已发布
      state = data ? '已发布' : '草稿'
      pageNum += 1
      getUserArticleById({
        pageNum: pageNum,
        state,
      }).then(res => {
        // console.log(res.data)
        if (res.data.status !== 1 && res.data.data.length !== 0) {
          nothing.value = false
          if (userArticle.data.length == 0) {
            userArticle.data = res.data.data
            console.log(userArticle.data)

          } else {
            userArticle.data.push(...res.data.data)
            console.log(userArticle.data)
            scrollStatus.value = false
          }


        } else {
          if (userArticle.data == []) {
            nothing.value = true
          }

        }
      }).catch(err => {
        console.log(err)
      })
    }
    //文章页跳转
    const goDetails = (articleId) => {
      window.open(`/#/${userData.data.username}/${articleId}`, '_blank')
      // console.log(router)
    }
    //滚轮刷新拉新
    let scrollStatus = ref(false)
    window.onmousewheel = () => {
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      //滚动条滚动距离
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      //窗口可视范围高度
      let clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
      //距离底部还有0.8视窗高度距离的时候触发加载
      // let canset = clientHeight*0.3
      //定义一个加载状态，防止触发多次拉取
      //scrollTop*2是为了在缩放的情况下也更好的获取到加载效果
      if (clientHeight + scrollTop * 1.01 >= scrollHeight) {
        if (scrollStatus.value == false) {
          scrollStatus.value = true
          getUserArticle()
          console.log(pageNum + 1, "===加载更多内容……===");
        }
        return


      }
    }
    // 销毁监听  (坑：移除监听事件时加true否则销毁不成功)
    onBeforeUnmount(()=>{
      window.removeEventListener("onmousewheel",window.onmousewheel,true)
    })
    const deleteArticle = (Id, index) => {
      deleteArticleById(Id).then(res => {
        userArticle.data.splice(index, 1)
        console.log(res)
      }).catch(err => {
        console.log(err)
      })

    }
    const updateArticle = (data)=>{
      router.push({
        path: `/${userData.data.username}/updateArticle`,query: {
          Id: data
        }
      })
    }
    return {
      getUserArticle,
      deleteArticle,
      updateArticle,
      nothing,
      goDetails,
      userArticle,
      avatarImg,
      articClassify,
      userData,
      formData,
      ruleFrom,
      viewIf,
      viewPsd,
      viewAdd,
      addArticinfo,
      viewArticCateData,
      currentData,
      articRefvalid,
      oldData,
      viewPsdClick,
      viewAddFun,
      onSubmit,
      updatePsd,
      cancle,
      getArticclassify,
      addArticclassify,
      deleteArticCate,
      viewArticCate,
      updateArticCate,
      changeAvatar,
      jumpToAdd,
      logout,
    };
  },
};
</script>
<style lang="scss" scoped>
.homebox {
  padding-top: 20px;

  .container {

    // height: 100vh;
    // overflow: auto;
    .userInfo {
      width: 41.6rem;
      height: 70rem;
      position: fixed;
      border-radius: 10px;
      // background: rgba($color: #175ed0, $alpha: 0.5);
      background-color: rgba($color: #ffffff, $alpha: 0.5);
      backdrop-filter: blur(0.5);

      .info {
        padding-top: 30px;
        .avatar{
          width: 35px;
          border-radius: 50%;
        }

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
      padding-left: 43.6rem;
      overflow: hidden;

      .classify {
        width: 100%;
        display: flex;

        .release {
          width: 50%;
          line-height: 36px;
          background-color: #409EFF;
        }

        .draft {
          width: 50%;
          line-height: 36px;
          background: #a81cce;
        }
      }

      .userArticle {

        // width: 1000px;
        // margin: 0 auto;
        // text-align: center;

        .nothing {
          line-height: 260px;
        }

        .Pb_li,
        .nothing {
          text-align: center;
          width: 41.6rem;
          height: 21.6rem;
          border-radius: 20px;
          margin: 0 auto 30px;
          background: rgba(255, 255, 255, .5);
          scale: 1;
          transition: scale 0.5s;
          overflow: hidden;
          backdrop-filter: blur(6px);
          // background: linear-gradient(to right, rgb(24, 24, 150), rgb(109, 103, 104));
          // animation: fadeInAnimation ease 1s;

          .info {
            word-wrap: break-word;
            line-height: 3rem;
            text-align: center;
            width: 100%;
          }

          .el-image {
            overflow: hidden;
            // background: rgb(109, 103, 104);
            width: 90%;
            height: 15rem;
          }

        }

        .Pb_li {
          position: relative;

          .editor,
          .delete {

            text-align: center;
            width: 50px;
            line-height: 50px;
            border-radius: 50%;
            position: absolute;
            top: calc(50% - 25px);
            right: calc(50% - 25px);
            display: none;
            animation-fill-mode: forwards;
            // right: calc(50% - 25px);
          }

          .editor {

            background: rgba($color: #939bf2, $alpha: .5);
          }

          .delete {
            background: rgba($color: #ea4c4c, $alpha: .5);
          }
        }

        .end {
          padding: 20px 0;
          text-align: center;
        }

        .Pb_li:hover,
        .nothing:hover {
          cursor: pointer;
          scale: 1.05;
          box-shadow: 1rem 1rem 4.16rem #1956B4;

          // animation: liHoverScale ease-in;
          .editor {
            display: block;
            animation: editor ease 1s;
            animation-fill-mode: forwards;
          }

          .delete {
            display: block;
            animation: delete ease 1s;
            animation-fill-mode: forwards;
          }

          .editor:hover {
            z-index: 999;
            background-color: #939bf2;
          }

          .delete:hover {
            z-index: 2;
            background-color: #ea4c4c;
          }
        }

        @keyframes editor {
          0% {
            opacity: 0;
            // right: calc(50% - 25px);

          }

          100% {
            opacity: 1;
            right: calc(100% - 50px);
          }
        }

        @keyframes delete {
          0% {
            opacity: 0;
            // right: calc(50% - 25px);

          }

          100% {
            opacity: 1;
            right: 0;
          }
        }

        @keyframes liHoverScale {
          from {
            scale: 1.0;
          }

          to {
            scale: 1.1;
          }
        }
      }
    }
  }
}
</style>
  