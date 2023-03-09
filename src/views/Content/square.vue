<template>
    <div class="square">
        <Header></Header>
        <div class="content">
            
            <ul>
                这里是卢本伟广场
                <h1>这里是卢本伟广场</h1> 
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <Dailog :formData="formData"></Dailog>
        </div>
        
    </div>
</template>
<script>
import { reactive } from 'vue'
import Header from '@/component/header.vue'
import Dailog from '@/component/dailog.vue'
export default {
    components: {
        Header,
        Dailog
    },
    setup(){
        const formData = reactive({
            user: {
                title: '1111'
            }
        })
        return{
            formData
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        padding-top: 56px;
        background-color: aqua;
        ul{
            // width: 1000px;
            // margin: 0 auto;
            text-align: center;
            li{
                width: 600px;
                height: 400px;
                margin: 0 auto 30px;
                background-color: black;
            }
        }
    }
</style>