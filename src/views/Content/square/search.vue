<template>
    <div class="search">
        <el-input placeholder="search" v-model="searchStr" @input="searchTip"></el-input>
        <el-button @click="search" class="iconfont icon-chazhao"></el-button>
        <div class="box" v-if="searchBox">
            <ul>
                <li class="article" :key="index" v-for="(item, index) in searchRes.data">
                    <div @click="changeTip(item.title)">
                        <h4>{{ item.title }}</h4>
                        <!-- <div>{{ item.content }}</div> -->
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { searchData } from '@/api/square/search'
export default {
    setup() {
        let route = useRoute()
        let queryQ = route.query.q
        console.log(route.query.q)
        let searchStr = ref('')
        const search = () => {
            let str = searchStr.value.trim()
            if (str == '') return
            // let q = searchStr.value.split(' ').filter((item) => {
            //     return item != ''
            // })
            searchData().then(res => {
                console.log(res)
            }).catch(err => {
                console.loh(err)
            })

        }
        search()
        searchData(queryQ).then(res => {
            console.log(res)
        }).catch(err => {
            console.loh(err)
        })
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
.search {
    position: relative;
    padding: 25px 0;
    text-align: center;

    .el-input {
        width: 25%;
    }

    .el-button {
        width: 5%;
    }

    .box {
        cursor: pointer;
        margin: 0 auto;
        width: 30%;
        text-align: left;
        border-radius: 8px;
        // overflow-y: scroll;
        z-index: 999;
        background-color: rgba($color: #446D99, $alpha: 0.7);
        backdrop-filter: blur(6px);
        position: absolute;
        left: 50%;
        transform: translate(-50%); //水平、垂直都居中,也可以写成下面的方式
    }
}
</style>