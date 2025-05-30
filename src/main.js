import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import store from './store'
// main.ts

// 路由守卫：控制页面访问权限
router.beforeEach((to, from) => {
  // 获取本地存储的token（注意：这里要和登录时保存的token名称一致）
  const token = localStorage.getItem('pz_token')
  
  // 如果没有token且不是登录页面，则跳转到登录页
  if(!token && to.path !== '/login') {
    return {
      path: '/login'
    }
  }
  // 如果有token但访问的是登录页，则跳转到首页
  else if(token && to.path === '/login') {
    return {
      path: '/'
    }
  }
  // 其他情况允许正常访问
  else {
    return true
  }
})


// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(store)  // 先注册 Vuex store
app.use(createPinia())  // 再注册 Pinia


app.mount('#app')
