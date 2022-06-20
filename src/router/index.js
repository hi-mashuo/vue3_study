import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/reports/Report.vue'

// 使用懒加载
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const Users = () => import('../components/user/Users.vue')
const Rights = () => import('../components/power/Rights.vue')
const Roles = () => import('../components/power/Roles.vue')
const Cate = () => import('../components/goods/Cate.vue')
const Params = () => import('../components/goods/Params.vue')
const List = () => import('../components/goods/List.vue')
const Add = () => import('../components/goods/Add.vue')
const Order = () => import('../components/order/Order.vue')
const Report = () => import('../components/reports/Report.vue')

const routes = [
  // 初始页面重定向
  {
    path: '/',
    redirect: '/login'
  },
  // 配置login页面，并在App.vue文件中添加router-view标签
  // 浏览器访问/login就会跳转到Login页面
  {
    path: '/login',
    component: Login
  },
  // home页面
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    // 在里面添加children就可以在页面里面再增加页面
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/goods',
      component: List
    }, {
      path: '/goods/add',
      component: Add
    }, {
      path: '/orders',
      component: Order
    }, {
      path: '/reports',
      component: Report
    }, ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 设置路由导航守卫 如果还没登录就只能访问登录页面
// to是要跳转到哪个页面
// from是从哪个页面跳转
// next是跳转函数
router.beforeEach((to, from, next) => {
  // 如果是登录页面就直接跳转
  if (to.path == '/login') return next()

  // 找出token
  const tokenStr = window.sessionStorage.getItem('token')
  // 无token就返回登录页面，有就继续跳转
  if (!tokenStr) return next('/login')
  // 没有next()就不会跳转
  next()
})

export default router