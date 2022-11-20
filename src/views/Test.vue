<template>
    <div class="son">
        <!-- <h1 class="son">姓名：{{res}}</h1>
        <button @click="btn">单击改变vuex仓库中的数据</button> -->
        
        <button @click="p1++">p1++</button>
       
    </div>
</template>
<script>
// import { computed } from 'vue'
// import { useStore } from 'vuex'
import {onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, ref} from 'vue'
export default({
    setup() {
        // //从vuex仓库中取数据
        // const store = useStore()
        // const res = computed(()=>{
        //     return store.state.name
        // })

        // //点击调用vuex并改变vuex仓库里的数据
        // function btn(){
        //     //异步调用:dispatch
        //     // store.dispatch('sub')
        //     //同步调用
        //     store.commit('tigger','雷军')

        // }
        console.log('setup')
        onBeforeMount(()=> {
            console.log('onBeforeMount,在挂载开始之前被调用')
        })
        onMounted(()=> {
            console.log('onMounted,组件挂载时调用')
        })
        onBeforeUpdate(()=> {
            console.log('onBeforeUpdate,数据更新时调用')
        })
        onUpdated(()=> {
            console.log('onUpdated,数据更改导致的虚拟DOM重新渲染,在这之后会调用该钩子函数')
        })
        onBeforeUnmount(()=> {
            console.log('onBeforeUnmount,在卸载组件实例之前调用')
        })
        onUnmounted(()=> {
            console.log('onUnmount,卸载组件实例之后调用')
        })
        onErrorCaptured(()=> {
            console.log('onErrorCaptured,当前捕获一个来自子孙组件的错误时被调用')
        })
        const p1 = ref(0)
        return {
            // res,
            // btn
            p1
        }
    },
})
</script>
<style scoped>
.son{
    height: 5000px;
    background-color: aquamarine;
}
</style>
