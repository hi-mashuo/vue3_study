<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <el-table :data="rightsList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="authName" label="权限名称"> </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
      <!-- 这里记得得使用v-slot -->
      <el-table-column label="权限等级">
        <template v-slot="scope">
          <el-tag v-if="scope.row.level == 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.level == 2">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'Rights',
  setup() {
    const { proxy } = getCurrentInstance()

    // 权限列表
    const rightsList = reactive({
      rightsList: [],
    })
    // 获取权限列表
    const getRightsList = async () => {
      const { data: res } = await proxy.$http.get('rights/list')
      if (res.meta.status != 200)
        return proxy.$message.error('权限列表获取错误')
      rightsList.rightsList = res.data
      console.log(rightsList)
    }
    getRightsList()

    const log = (t) => {
      console.log(t)
    }
    return {
      ...toRefs(rightsList),
      getRightsList,
      log,
    }
  },
})
</script>

<style scoped></style>
