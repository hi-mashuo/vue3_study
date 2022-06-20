<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <el-row :gutter="12">
      <el-col :span="8">
        <!-- 订单搜索输入框 -->
        <el-input
          placeholder="请输入内容"
          v-model="query"
          clearable
          @change="queryOrder"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="queryOrder"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!-- 订单表 -->
    <el-row :gutter="10">
      <el-col>
        <el-table :data="orderList" border stripe>
          <el-table-column type="index"> </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号"
          ></el-table-column>
          <el-table-column prop="order_price" label="订单价格">
          </el-table-column>
          <el-table-column prop="is_send" label="是否付款">
            <template v-slot="scope">
              <el-tag type="success" v-if="scope.row.pay_status == '1'"
                >已付款</el-tag
              >
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="下单时间">
            <template v-slot="scope">
              {{ $filters.dateFormat(scope.row.create_time * 1000) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
            <template v-slot="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="addressDialogFormVisible = true"
              ></el-button>

              <!-- 删除按钮 -->
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="progressDialogOpen(scope.row)"
              ></el-button>
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
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-row>
  </el-card>

  <!-- 修改订单地址对话框 -->
  <el-dialog
    title="订单修改"
    v-model="addressDialogFormVisible"
    width="50%"
    @close="addressDialogClose"
  >
    <el-form :model="addressForm" :rules="addressFormRule">
      <el-form-item label="省市区/县" prop="address1">
        <el-cascader
          v-model="addressForm.address1"
          :options="citys"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addressDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogFormVisible = false"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 查看物流进度对话框 -->
  <el-dialog title="物流进度" v-model="progressDialogVisible" width="50%">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in pgData"
        :key="index"
        :timestamp="activity.time"
      >
        {{ activity.context }}
      </el-timeline-item>
    </el-timeline>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue'
import outerData from './citydata'

export default defineComponent({
  name: 'Order',
  setup() {
    const { proxy } = getCurrentInstance()

    // 订单数据
    const orderList = reactive({
      orderList: [],
    })
    // 订单总量
    const total = ref(0)
    // 查询信息
    const queryInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5,
    })
    // 查询订单
    const queryOrder = async () => {
      const { data: res } = await proxy.$http.get('orders', {
        params: queryInfo,
      })
      if (res.meta.status != 200)
        return proxy.$message.error('查询订单失败' + res.meta.msg)
      console.log(res)
      total.value = res.data.total
      orderList.orderList = res.data.goods
    }
    queryOrder()

    // =============================================================================
    // 分页
    const handleSizeChange = (newSize) => {
      queryInfo.pagesize = newSize
      queryOrder()
    }
    const handleCurrentChange = (newPage) => {
      queryInfo.pagenum = newPage
      queryOrder()
    }
    const currentPage4 = (newPage) => {
      queryInfo.pagenum = newPage
      queryOrder()
    }

    // =============================================================================
    // 修改订单地址对话框
    // 对话框显示
    const addressDialogFormVisible = ref(false)
    // 订单地址信息
    const addressForm = reactive({
      address1: [],
      address2: '',
    })
    // 订单地址填写规则
    const addressFormRule = reactive({
      address1: [{ required: true, message: '请选择城市', trigger: 'blur' }],
      address2: [
        { required: true, message: '请填写详细地址', trigger: 'blur' },
      ],
    })
    // 所有城市
    const citys = reactive(outerData.cityData)
    // 订单地址对话框关闭
    const addressDialogClose = () => {
      addressForm.address1 = []
      addressForm.address2 = ''
      addressDialogFormVisible.value = false
    }

    // =============================================================================
    // 物流进度对话框
    // 对话框显示
    const progressDialogVisible = ref(false)
    // 物流信息
    const pgData = reactive({
      pgData: [],
    })
    // 打开对话框
    const progressDialogOpen = async (data) => {
      // 这里发送请求后台就会蹦,所以直接给假数据
      //       const { data: res } = await proxy.$http.get(`/kuaidi/804909574412544580
      // `)
      //       console.log(res)
      //       if (res.meta.status != 200)
      //         return proxy.$message.error('查询订单失败' + res.meta.msg)
      pgData.pgData = outerData.progressData
      progressDialogVisible.value = true
    }

    return {
      queryInfo,
      total,
      addressDialogFormVisible,
      addressForm,
      addressFormRule,
      citys,
      progressDialogVisible,
      ...toRefs(pgData),
      ...toRefs(orderList),
      queryOrder,
      handleSizeChange,
      handleCurrentChange,
      currentPage4,
      addressDialogClose,
      progressDialogOpen,
    }
  },
})
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
