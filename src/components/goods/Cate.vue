<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 添加分类按钮 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-button type="primary" @click="CateDialogOpen">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 商品分类展示 -->
    <el-row>
      <el-col>
        <el-table
          :data="cateList"
          style="width: 100%;margin-bottom: 20px;"
          row-key="cat_id"
          :tree-props="{ children: 'children' }"
          indent="30"
          border
        >
          <el-table-column prop="index" label="#" width="100px">
          </el-table-column>
          <!-- 分类名称 -->
          <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
          <!-- 是否有效 -->
          <el-table-column prop="cat_deleted" label="是否有效">
            <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
            <template v-slot="scope">
              <i
                class="el-icon-success"
                v-if="!scope.row.cat_deleted"
                style="color:lightgreen"
              ></i>
              <i class="el-icon-danger" v-else style="color:red"></i>
            </template>
          </el-table-column>
          <!-- 排序 -->
          <el-table-column prop="cat_level" label="排序">
            <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
            <template v-slot="scope">
              <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.cat_level == 1"
                >二级</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.cat_level == 2"
                >三级</el-tag
              >
            </template>
          </el-table-column>
          <!-- 排序 -->
          <el-table-column label="操作">
            <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
            <template v-slot="scope">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini"
                >编辑</el-button
              >

              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"
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
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-row>
  </el-card>

  <!-- 添加分类对话框 -->
  <el-dialog
    title="添加分类"
    v-model="showCateDialogVisible"
    width="50%"
    @close="CateDialogClose"
  >
    <el-form
      :model="addCateForm"
      :rules="cateFormRules"
      ref="cateFormRef"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">
        <el-cascader
          v-model="selectKeys"
          :options="parentCateList"
          :props="cascaderProps"
          @change="parentCateChange"
          clearable
          style="width:100%;"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCate">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue'

export default defineComponent({
  name: 'Cate',
  setup() {
    const { proxy } = getCurrentInstance()

    // 商品分类列表
    const cateList = reactive({
      cateList: [],
    })
    // 查询参数
    const queryInfo = reactive({
      type: 3,
      pagenum: 1,
      pagesize: 5,
    })
    // 总页数
    const total = reactive({
      total: 0,
    })
    // 页面数
    const pagesize = ref(queryInfo.pagesize)

    // 分页函数
    const handleSizeChange = (newSize) => {
      queryInfo.pagesize = newSize
      getCate()
    }
    const handleCurrentChange = (newPage) => {
      queryInfo.pagenum = newPage
      getCate()
    }
    const currentPage4 = (newPage) => {
      queryInfo.pagenum = newPage
      getCate()
    }

    // 获取商品分类数据
    const getCate = async () => {
      const { data: res } = await proxy.$http.get('categories', {
        params: queryInfo,
      })
      if (res.meta.status != 200) proxy.$message.error('获取商品分类数据出错')
      total.total = res.data.total
      cateList.cateList = res.data.result
    }
    getCate()

    // =============================================================================
    // 添加分类
    const showCateDialogVisible = ref(false)
    // 添加分类表单数据
    const addCateForm = reactive({
      cat_pid: 0,
      cat_name: '',
      cat_level: 0,
    })
    // 添加分类表单规则
    const cateFormRules = reactive({
      cat_name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
      ],
    })

    // 添加分类对话框打开
    const CateDialogOpen = () => {
      getCateParent()
      showCateDialogVisible.value = true
    }

    // 选择器里被选择的值
    let selectKeys = ref([])
    // 选择器内容
    let parentCateList = reactive({
      parentCateList: [],
    })
    // 选择器配置
    const cascaderProps = reactive({
      value: 'cat_id',
      label: 'cat_name',
      children: 'children',
      expandTrigger: 'hover',
      checkStrictly: true,
    })
    // 选择器改变
    const parentCateChange = () => {
      if (selectKeys.value) {
        addCateForm.cat_pid = selectKeys.value[selectKeys.value.length - 1]
        addCateForm.cat_level = selectKeys.value.length
      } else {
        addCateForm.cat_pid = 0
        addCateForm.cat_level = 0
      }
    }

    // 获取父级商品分类数据
    const getCateParent = async () => {
      const { data: res } = await proxy.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status != 200) proxy.$message.error('获取商品分类数据出错')
      parentCateList.parentCateList = res.data
    }

    // 添加分类对话框引用
    const cateFormRef = ref(null)
    // 确认添加分类
    const submitAddCate = () => {
      // 这里使用记得得加上.value
      cateFormRef.value.validate(async (val) => {
        if (!val) {
          return proxy.$message.error('信息填写错误')
        }
        const { data: res } = await proxy.$http.post('categories/', addCateForm)
        if (res.meta.status != 201)
          return proxy.$message.error('添加分类失败' + res.meta.msg)
        proxy.$message.success({
          message: '添加分类成功',
          type: 'success',
        })
        getCate()
        showCateDialogVisible.value = false
      })
    }

    // 添加分类对话框关闭
    const CateDialogClose = () => {
      addCateForm.cat_name = ''
      addCateForm.cat_pid = 0
      addCateForm.cat_level = 0
      selectKeys.value = []
    }

    return {
      queryInfo,
      total,
      pagesize,
      showCateDialogVisible,
      addCateForm,
      cateFormRules,
      selectKeys,
      cascaderProps,
      cateFormRef,
      ...toRefs(parentCateList),
      ...toRefs(cateList),
      ...toRefs(total),
      handleSizeChange,
      handleCurrentChange,
      currentPage4,
      parentCateChange,
      CateDialogOpen,
      submitAddCate,
      CateDialogClose,
    }
  },
})
</script>

<style scoped></style>
