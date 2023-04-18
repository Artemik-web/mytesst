// import {computed} from 'vue'
import { createStore } from "vuex"

export default createStore({
  //创建数据仓库
  state: {
    // isloading: false,
    islogin: false,
    // client: window.matchMedia('(min-width: 768px)').matches? 'pc' : 'mobile'
    client: window.matchMedia('(min-width: 560px)').matches? 'pc' : 'mobile',
    username: '',
  },
 
  //同步调用
  mutations: {
    // changeLoading(state, val){
    //   state.isloading = val
    // },
    tigger(state,val){
      
      state.client = val
      // console.log('我是同步调用的方法',state.client)
    }
  },
  //异步调用
  actions: {
    sub(store){
      // console.log('****,我是异步调用')
      //不能直接调用
      store.commit('tigger')
    }
  }
})
