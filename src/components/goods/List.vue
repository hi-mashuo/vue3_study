<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 查询 -->
    <el-row :gutter="12">
      <el-col :span="8">
        <!-- 用户搜索输入框 -->
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @change="getGoodsList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addGoodPage">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 商品展示 -->
    <el-row>
      <el-col>
        <el-table :data="goodsList" border stripe>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            width="105px"
          >
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="80px">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="160px">
            <template v-slot="scope">
              {{ $filters.dateFormat(scope.row.add_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeGood(scope.row.goods_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[1, 5, 10, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalGoods"
      >
      </el-pagination>
    </el-row>
  </el-card>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  computed,
  ref,
} from 'vue'

export default defineComponent({
  name: 'List',
  setup() {
    const { proxy } = getCurrentInstance()

    // =============================================================================
    // 查询
    // 查询信息
    const queryInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5,
    })
    // 商品列表
    const goodsList = reactive({
      goodsList: [],
    })
    // 商品查询
    const getGoodsList = async () => {
      const { data: res } = await proxy.$http.get('goods', {
        params: queryInfo,
      })
      console.log(res)
      if (res.meta.status != 200)
        return proxy.$message.error('商品查询失败' + res.meta.msg)
      goodsList.goodsList = res.data.goods
      totalGoods.value = res.data.total
    }
    getGoodsList()

    // =============================================================================
    // 分页

    // 总页面
    let totalGoods = ref(0)

    //
    const handleSizeChange = (newPage) => {
      queryInfo.pagesize = newPage
      getGoodsList()
    }
    const handleCurrentChange = (newPage) => {
      queryInfo.pagenum = newPage
      getGoodsList()
    }
    const currentPage4 = (newPage) => {
      queryInfo.pagenum = newPage
      getGoodsList()
    }

    // =============================================================================
    // 删除商品
    const removeGood = async (id) => {
      const { data: res } = await proxy.$http.delete('goods/' + id)
      console.log(res)
      if (res.meta.status != 200)
        return proxy.$message.error('商品删除失败' + res.meta.msg)

      getGoodsList()
      return proxy.$message.success('商品删除成功')
    }

    // 添加商品
    // 跳转到添加商品页面
    const addGoodPage = () => {
      proxy.$router.push('/goods/add')
    }

    return {
      totalGoods,
      queryInfo,
      ...toRefs(goodsList),
      getGoodsList,
      handleSizeChange,
      handleCurrentChange,
      currentPage4,
      removeGood,
      addGoodPage,
    }
  },
})
</script>

<style scoped></style>
