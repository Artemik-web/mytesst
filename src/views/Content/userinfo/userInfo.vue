<template>
  <div class="homebox">
    <div class="container">
      <div class="avatarList">
          <el-button @click="jumpToAdd">写文章</el-button>
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
          <user  v-show="client === 'pc'" ref="userRef" @viewinfoClick="viewinfoClick" @viewPsdClick="viewPsdClick"></user>
          <articleList @goDetails="goDetails" @updateArticle="updateArticle"></articleList>
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
    <el-dialog :lock-scroll="false" v-model="viewOnce" :title="formData.userInfo.title" :show-close="false"
      :close-on-press-escape="false">
      <pb_form ref="user_form" :formData="formData.userInfo"></pb_form>
      <el-button @click="updateinfo">提交</el-button>
    </el-dialog>
    <el-dialog :lock-scroll="false" v-model="viewPsd" :title="formData.updatePassword.title" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <pb_form ref="psd_form" :formData="formData.updatePassword"></pb_form>
      <el-button @click="updatePsd">提交</el-button>
    </el-dialog>
  </div>
</template>
<script>
import { useStore } from 'vuex';
import user from './userinfoComponent/user.vue'
import articleList from './userinfoComponent/article_list.vue'

// import Dialog_form from "@/component/dialog_form.vue";
import pb_form from "@/component/pb_form.vue";
import router from "@/router";
import { ElMessage } from "element-plus";
import { reactive, ref, onMounted, computed } from "vue";
import { updateUserinfo } from "@/api/userinfo/updateUserinfo";
import { updatePasd } from "@/api/userinfo/updatePsd";
import { getClassify } from "@/api/square/getClassify"
import { addClassify } from "@/api/userinfo/addClassify"
import { deleteCate } from "@/api/userinfo/deleteCate"
import { uplateArticCate } from "@/api/userinfo/uplateArticCate"
// import Dialog from '@/component/dialog.vue'
export default {
  components: {
    // Dialog_form
    pb_form,
    user,
    articleList
  },
  setup() {
    let store = useStore()
    let client = computed(()=>{
      return store.state.client
    })
    const userRef = ref('userRef')

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
        ]
      },

    })
    //密码更改dialog函数
    let viewOnce = ref(false)
    const viewinfoClick = (d) => {
      console.log(d)
      viewOnce.value = d

    }
    //密码更改dialog函数
    let viewPsd = ref(false)
    const viewPsdClick = () => {
      viewPsd.value = true
      // console.log(viewOnce)
    }
    //密码dialog密码更改函数
    const psd_form = ref('psd_form')
    const updatePsd = () => {
      psd_form.value.formCheck(() => {
        let psd_form_data = psd_form.value.Data
        console.log(psd_form_data)
        updatePasd({
          oldPwd: psd_form_data.oldPwd,
          newPwd: psd_form_data.newPwd
        }).then(res => {
          if (res.data.status == 0) {
            ElMessage({ message: '密码修改成功!', type: 'success' })
            viewPsd.value = false
            //表单数据清理
            psd_form.value.formClear()
            console.log(res)
          } else {
            ElMessage({ message: res.data.message, type: 'error' })
          }

        })
      })

    }
    const ruleFrom = ref(null);
    let user_form = ref('user_form')
    //写在这里是不行的，setup相当于创建前后这个时候还未挂载user_form.value是没有数据的
    // let user_form_data = user_form.value.Data
    //第一次登陆时更新用户信息
    //更新用户信息函数
    const updateinfo = () => {
      console.log(user_form.value)
      //表单校验函数
      user_form.value.formCheck(() => {
        let user_form_data = user_form.value.Data
        console.log(user_form_data, user_form.value.Data)
        let data = {
          nickname: user_form_data.nickname,
          email: user_form_data.email,
        }
        updateUserinfo(data).then((res) => {
          if (res.data.status == 0) {
            userRef.value.userData.data.nickname = data.nickname
            userRef.value.userData.data.email = data.email
            viewinfoClick(false)
            user_form.value.formClear()

          } else {
            ElMessage({ message: res.data.message, type: 'error' })
          }



        })
          .catch((error) => {
            return error;
          });
      })

    };
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
    //跳转至文章添加页
    const jumpToAdd = () => {

      let path_username = userRef.value.userData.data.username
      router.push({
        path: `/${path_username}/addArticle`
      })
    }





    const updateArticle = (data) => {
      router.push({
        path: `/${userRef.value.userData.data.username}/updateArticle`, query: {
          Id: data
        }
      })
    }
    onMounted(() => {
      console.log(userRef.value.viewIfnic)
      // viewOnce.value = userRef.value.viewOnce

    })
    //文章页跳转
    const goDetails = (articleId) => {
      // console.log(articleId,userRef.value)
      window.open(`/#/${userRef.value.userData.data.username}/${articleId}`, '_blank')
      // context.emit('goDetails',articleId)
    }
    return {
      client,
      userRef,
      user_form,
      psd_form,
      updateArticle,
      goDetails,
      articClassify,
      userData,
      formData,
      ruleFrom,
      viewOnce,
      viewPsd,
      viewAdd,
      addArticinfo,
      viewArticCateData,
      currentData,
      articRefvalid,
      oldData,
      viewinfoClick,
      viewPsdClick,
      viewAddFun,
      updateinfo,
      updatePsd,
      getArticclassify,
      addArticclassify,
      deleteArticCate,
      viewArticCate,
      updateArticCate,
      jumpToAdd,
    };
  },
};
</script>
<style lang="scss" scoped>
.homebox {
  max-width: 100rem;
  padding-top: 20px;

}
</style>
  