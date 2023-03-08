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
        </div>
        
    </div>
</template>
<script>
import Header from '@/component/header.vue'
export default {
    components: {
        Header
    },
    setup(){

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