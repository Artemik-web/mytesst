<template>
        <div class="userInfo" v-if="userData.data">
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

                <el-button class="psd" @click="updateBtn">重置密码</el-button>
            </div>

            <el-button style="background-color: #409EFF;margin-left: 10px;color: white;" @click="logout">退出</el-button>
            
        </div>
</template>

<script>
import { useStore } from "vuex";
import { reactive, ref } from "vue";
import { removeToken } from "@/untils/setToken";
import { deleteSessionStorage } from "@/untils/setSession";
import router from "@/router";
import { ElMessage } from "element-plus";
import { getUserinfo } from "@/api/userinfo/getUserinfo";
import { getClassify } from "@/api/square/getClassify"
import { updateAvatar } from "@/api/userinfo/updateAvatar";
export default {
    setup(props, context) {
        let viewIfnic = ref(false)
        const store = useStore();
        const userData = reactive({
            data: []
        })
        //定义reactive类型响应数据来接受getuserInfo()得到的user数据
        //用户信息获取函数
        //页面创建前获取用户信息
        let avatarImg = ref('')
        function getinfo() {
            getUserinfo().then((res) => {
                userData.data = res.data.data;
                avatarImg.value = res.data.data.user_pic || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
                store.state.username = res.data.data.username;
                // console.log(!res.data.data.nickname)
                if (!res.data.data.nickname) {
                    // console.log(context)
                    context.emit('viewinfoClick', true)
                    // console.log(viewIfnic)
                } else {
                    context.emit('viewinfoClick', false)
                }

                getArticclassify()
                // getUserArticle()
            }).catch(err => {
                console.log(err)
            })
                ;
        }
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


        //头像修改函数
        // let avatarImg = ref("");
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
        // //密码更改函数
        // let viewPsd = ref(false)
        const updateBtn = () => {
            context.emit('viewPsdClick')
            // console.log(context.emit('viewPsdClick'))
            //     viewPsd.value = true
        }
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
        const updateuser = (data) => {
            console.log(data)
            userData.data.nickname = data.nickname
            userData.data.email = data.email
        }
        //获取用户信息
        getinfo();
        return {
            userData,
            avatarImg,
            viewIfnic,
            updateuser,
            updateBtn,
            changeAvatar,
            logout
        }
    }
}
</script>
<style lang="scss" scoped>
.userInfo {
    width: 40%;
    height: 50%;
    float: left;
    border: 1px solid red;

    border-radius: 10px;
    // background: rgba($color: #175ed0, $alpha: 0.5);
    background-color: rgba($color: #ffffff, $alpha: 0.5);
    backdrop-filter: blur(0.5);

    .info {
        padding-top: 30px;

        .avatar {
            width: 50px;
            height: 50px;
            border: 1px solid red;
            // object-fit: cover;
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
</style>