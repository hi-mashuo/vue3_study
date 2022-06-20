import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')

// 将axios注册为全局property
app.config.globalProperties.$http = axios
// 指定默认URL
axios.defaults.baseURL = 'http://www.puxinboy.com:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 自动获取token
axios.interceptors.request.use(config => {
  // 进度条开始
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  // 进度条结束
  NProgress.done();
  return config
})


// 全局过滤器
app.config.globalProperties.$filters = {
  // 时间格式计算
  dateFormat(date) {
    const time = new Date(date)
    const y = time.getFullYear()
    const m = time.getMonth() + 1
    const d = time.getDate() + 1

    const hh = time.getHours()
    const mm = time.getMinutes()
    const ss = time.getSeconds()

    return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`
  }
}