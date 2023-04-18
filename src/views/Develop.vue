<template>
    <div class="dev">
        <Header></Header>
        <div style="padding-top: 56px;">开发者工作站</div>
        <div class="search">
            <el-input class="searchInput" size="small" v-model="input"></el-input>
            <a class="searchIcon" :href="`${currentTabUrl.url}${input}`" target="_blank">
                <img class="searchLogo" :src="currentTabUrl.logo" />
            </a>
        </div>

        <div class="devBox">
            <ul class="tools">
                <li class="tool" :key="index" v-for="(item, index) in toolsData.data">
                    <a :href="`${item.url}${input}`" target="_blank">
                        <img class="toollogo" :src="item.logo" />
                        {{ item.title }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import Header from '@/component/header.vue'
import { ref, reactive } from 'vue';

export default {
    components: {
        Header
    },
    setup() {
        let input = ref('')
        let toolsData = reactive({
            data: [
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
                {
                    title: '百度',
                    url: 'https://www.baidu.com/s?ie=UTF-8&wd=',
                    logo: 'https://cn.hk.uy/W6q'
                },
            ]
        })
        let searchPath = reactive({
            data: [
                { url: 'https://www.baidu.com/s?ie=UTF-8&wd=', logo: 'https://cn.hk.uy/W6q' },
                { url: 'https://juejin.cn/search?type=2&query=', logo: 'https://cn.hk.uy/W6r' },
                { url: 'https://so.csdn.net/so/search?t=blog&q=', logo: 'https://image.personalblog.cn/admin-1681116059905' },
                { url: 'https://www.oschina.net/search?q=', logo: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.oqgMBErElKN2GBSjwPYosAAAAA?w=168&h=176&c=7&r=0&o=5&pid=1.7' },
                { url: 'https://kaifa.baidu.com/searchPage?wd=', logo: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.g_fv819cTalb1hi27bGGpwAAAA?w=173&h=180&c=7&r=0&o=5&pid=1.7' },
                { url: 'https://www.zhihu.com/search?type=content&q=', logo: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.kTQ7aG4ocAECQj9Jn2xTuAHaHV?w=172&h=180&c=7&r=0&o=5&pid=1.7' },
                { url: 'https://segmentfault.com/search?q=', logo: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.4z0FXIQazrYEaK7dWGPmiAAAAA?w=176&h=180&c=7&r=0&o=5&pid=1.7' },
                { url: 'https://www.jianshu.com/search?q=', logo: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.kiRT8fmHT1eDw2duKydKngAAAA?w=159&h=169&c=7&r=0&o=5&pid=1.7' },
            ]
        })
        let currentTabUrl = ref('')
        currentTabUrl.value = searchPath.data[0]
        const Tab = (e) => {
            if (e.keyCode == 9) {
                //取消浏览器tab默认事件
                e.preventDefault()
                currentTabUrl.value = searchPath.data[searchPath.data.indexOf(currentTabUrl.value) + 1 < searchPath.data.length ? searchPath.data.indexOf(currentTabUrl.value) + 1 : 0]
                document.querySelector('.searchInput').focus()
            }


        }
        document.addEventListener("keydown", Tab);
        return {
            input,
            Tab,
            currentTabUrl,
            toolsData

        }
    }
}
</script>
<style lang="scss" scoped>
.dev {
    position: relative;
    color: red;
    

    .search {
        text-align: center;
        line-height: 30px;
        min-width: 300px;

        .searchInput {
            width: 200px;

        }

        .searchLogo {
            width: 25px;
            height: 40px;
            vertical-align: middle;
            object-fit: contain;
        }
    }

    .devBox {
        // padding: 10px 50px;
        // max-width: 100rem;
       
        .tools {
            // display: flex;
            // flex-wrap: wrap ;
            .tool {
                display: inline-block;
                .toollogo {
                    width: 25px;
                    height: 40px;
                    vertical-align: middle;
                    object-fit: contain;
                }
            }
        }
    }

}
</style>