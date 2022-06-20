<template>
  <!-- 主体 -->
  <el-container class="el-container">
    <!-- 头部 -->
    <el-header class="el-header">
      <div>
        <img src="../assets/uranus.png" alt="" width="60" height="60" />
        <span>vue3商城</span>
      </div>
      <!-- 退出登录 -->
      <el-button type="info" @click="Logout">退出</el-button>
    </el-header>

    <!-- 左侧菜单栏 -->
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'" class="el-aside">
        <div class="toggle-button not-select" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#96d0ff"
          text-color="#000"
          active-text-color="#4b39da"
          :uniqueOpened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- index只接受字符串类型，id是数字类型在后面加上空字符串就变成字符串了 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template #title>
              <i :class="icoList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="child.path"
              v-for="child in item.children"
              :key="child.id"
              @click="saveActiceState(child.path)"
            >
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      
      <!-- 子页面 -->
      <el-main class="el-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// getCurrentInstance用于获取$http
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Home',
  setup() {
    // 使用proxy获取挂载的axios
    const { proxy } = getCurrentInstance()
    const router = useRouter()
    // 左侧导航栏图标
    const icoList = reactive({
      '125': 'iconfont icon-users',
      '103': 'iconfont icon-tijikongjian',
      '101': 'iconfont icon-3702mima',
      '102': 'iconfont icon-danju',
      '145': 'iconfont icon-baobiao',
    })
    let isCollapse = ref(false)
    let activePath = ref(window.sessionStorage.getItem('activePath'))
    // 暂时不清楚的原因，获取menuList还需要给他套一层list
    let list = reactive({
      menuList: [],
    })

    // 获取菜单列表
    async function getMenuList() {
      const { data: res } = await proxy.$http.get('menus')
      if (res.meta.status != 200) return proxy.$message.error('res.meta.msg')
      list.menuList = res.data
      return res.data
    }
    getMenuList()

    // 退出登录
    const Logout = () => {
      // 清除token
      window.sessionStorage.clear()
      router.push('/login')
    }

    // 导航栏缩放
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    // 切换活跃页面
    const saveActiceState = (str) => {
      window.sessionStorage.setItem('activePath', str)
    }

    return {
      ...toRefs(list),
      icoList,
      isCollapse,
      activePath,
      saveActiceState,
      Logout,
      toggleCollapse,
    }
  },
})
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: #a46798;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: #96d0ff;
  overflow: hidden;
  transition: 0.3s;
}
.el-main {
  background-color: #e6dddd;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border: 0;
}
.toggle-button {
  text-align: center;
  margin: 5px;
  cursor: pointer;
}
</style>
