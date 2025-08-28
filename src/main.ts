import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import router from './router'
import 'element-plus/theme-chalk/dark/css-vars.css'

/* FontAwesome 核心 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* 一次性引入整包图标（方便，但体积大） */
import { fas } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas)      // 把图标加入库



const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon) // 全局注册 font awesome
app.use(ElementPlus).mount('#app')
