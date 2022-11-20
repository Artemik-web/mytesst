<template>
  <!-- //pc端 -->
  <div v-if="client === 'pc'">
    <div class="common-layout">
      <el-container class="pc_container">
        <el-header>Header</el-header>
        
        <el-container class="pc_main">
        <el-main>Main
            <el-aside class="pc_aside" width="400px">
            Aside
            </el-aside>
        </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
  <!-- //手机端 -->
  <div v-else>
    <div class="login_box">
      <div class="content">
        
      </div>
    </div>
  </div>
</template>
<script>
import { computed,reactive,toRefs, getCurrentInstance } from 'vue'
import {useStore} from 'vuex'
export default{
  setup(){
    const a = getCurrentInstance()
    console.log(a)
    const user = reactive({

    })
    const store = useStore()
    const client = computed(()=>{return store.state.client})

  return {
    client,
    ...toRefs(user),
  }
}
}

</script>
<style lang="less" scoped>
.pc_container {
  background-color: yellow;
  .el-header {
    z-index: 999;
      background-color: beige;
    }
  .pc_main {
    height: 100vh;
    background-color: aqua;
    
    .el-main {
      background-color: darkblue;
    }
    .el-footer {
      background-color: forestgreen;
    }
  }
  .pc_aside {
    width: 200px;
    background-color: white;
    .el-form{
      margin: 0 auto;
      width: 320px;
    }
    .action{
      text-align: center;

      // display: flex;
    }
  }
}


    
</style>
