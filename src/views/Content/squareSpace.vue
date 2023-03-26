<template>
    <div class="squareSpace">
        <Header></Header>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import Header from '@/component/header'
export default{
    components:{
        Header
    },
    setup(){


        return{

        }
    }
}
</script>