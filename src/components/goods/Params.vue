<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 警告 -->
    <el-row :gutter="10">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
    </el-row>
    <!-- 商品分类选择 -->
    <el-row class="cat_op">
      <el-col :span="3" class="el-span">
        <span>选择商品分类：</span>
      </el-col>
      <el-col :span="8">
        <el-cascader
          v-model="selectKeys"
          :options="cateList"
          :props="cascaderProps"
          clearable
          style="width:100%;"
          @change="cascaderChange"
        ></el-cascader>
      </el-col>
    </el-row>

    <!-- 标签页 -->
    <el-row class="cat_op">
      <el-tabs
        v-model="tabActiveName"
        @tab-click="tabsChange"
        style="width:100%"
      >
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="tabButtonDisable"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 表格 -->
          <el-table
            :data="manyTableData"
            row-key="attr_id"
            :expand-row-keys="expandList"
            @expand-change="expandChange"
            border
            stripe
          >
            <el-table-column type="expand">
              <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
              <template v-slot="scope">
                <!-- 标签 -->
                <el-tag
                  type="primary"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  class="el-tag"
                  closable
                  @close="removeTag(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作" width="300">
              <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editOpen(scope.row.attr_id)"
                  >编辑</el-button
                >

                <!-- 删除按钮 -->
                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                  @confirm="removeParams(scope.row.attr_id)"
                >
                  <template #reference>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="tabButtonDisable"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 表格 -->
          <el-table
            :data="onlyTableData"
            row-key="attr_id"
            :expand-row-keys="expandList"
            @expand-change="expandChange"
            border
            stripe
          >
            <el-table-column type="expand">
              <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
              <template v-slot="scope">
                <!-- 标签 -->
                <el-tag
                  type="primary"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  class="el-tag"
                  closable
                  @close="removeTag(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作" width="300">
              <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editOpen(scope.row.attr_id)"
                  >编辑</el-button
                >

                <!-- 删除按钮 -->
                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                  @confirm="removeParams(scope.row.attr_id)"
                >
                  <template #reference>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-card>

  <!-- 添加对话框 -->
  <el-dialog
    :title="'添加' + addTitle"
    v-model="addDialogVisible"
    width="50%"
    @close="addClose"
  >
    <!-- 表单 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
      <el-form-item :label="addTitle + '名称'" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改对话框 -->
  <el-dialog
    :title="'修改' + addTitle"
    v-model="editDialogVisible"
    width="50%"
    @close="editClose"
  >
    <!-- 表单 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
      <el-form-item :label="addTitle + '名称'" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  toRefs,
  getCurrentInstance,
  reactive,
  ref,
  computed,
} from 'vue'

export default defineComponent({
  name: 'Params',
  setup() {
    const { proxy } = getCurrentInstance()

    // 商品分类列表
    const cateList = reactive({
      cateList: [],
    })

    // 获取商品分类数据
    const getCate = async () => {
      const { data: res } = await proxy.$http.get('categories')
      if (res.meta.status != 200) proxy.$message.error('获取商品分类数据出错')
      cateList.cateList = res.data
    }
    getCate()

    // 级联选择器里被选择的值
    let selectKeys = ref([])
    // 级联选择器配置
    const cascaderProps = reactive({
      value: 'cat_id',
      label: 'cat_name',
      children: 'children',
      expandTrigger: 'hover',
    })
    // 选择内容发生改变时
    const cascaderChange = () => {
      // 判断选中的是否为第三级分类
      if (selectKeys.value.length < 3) {
        selectKeys.value = []
        manyTableData.manyTableData = []
        onlyTableData.onlyTableData = []
        return proxy.$message.warning({
          message: '只能选择三级分类',
          type: 'warning',
        })
      }
      getParamsData()
    }

    // =============================================================================
    //标签页
    // 当前打开标签页名称
    const tabActiveName = ref('many')
    // 发生标签页切换
    const tabsChange = () => {
      getParamsData()
    }

    // 是否禁用标签页中的按钮
    const tabButtonDisable = computed(() => {
      if (selectKeys.value.length !== 3) {
        return true
      } else {
        return false
      }
    })
    // 计算分类id
    const cateId = computed(() => {
      if (selectKeys.value.length === 3) {
        return selectKeys.value[2]
      } else {
        return null
      }
    })

    // 动态参数列表
    const manyTableData = reactive({
      manyTableData: [],
    })
    // 静态属性列表
    const onlyTableData = reactive({
      onlyTableData: [],
    })
    // 向后台发送请求获取动态参数/静态属性列表
    const getParamsData = async () => {
      // 发送获取参数或属性列表的请求
      const { data: res } = await proxy.$http.get(
        `categories/${cateId.value}/attributes`,
        {
          params: {
            sel: tabActiveName.value,
          },
        }
      )
      // 将attr_vals转换为数组的形式
      res.data.forEach((el) => {
        el.attr_vals = el.attr_vals ? el.attr_vals.split(',') : []
        // 控制添加标签的打开
        el.inputVisible = false
      })
      console.log(res)

      if (res.meta.status != 200) {
        proxy.$message.error('动态参数/静态属性列表获取失败')
      }
      if (tabActiveName.value == 'many') manyTableData.manyTableData = res.data
      else onlyTableData.onlyTableData = res.data
    }

    // =============================================================================
    // 添加的对话框
    // 要添加的数据内容
    const addForm = reactive({
      attr_name: '',
    })
    // 添加表单规则
    const addFormRules = reactive({
      attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    })
    // 标题
    const addTitle = computed(() => {
      if (tabActiveName.value == 'many') return '动态参数'
      else return '静态属性'
    })
    // 控制打开或关闭对话框
    // RNM!!false不要加引号啊啊啊啊啊啊啊啊啊啊啊啊
    const addDialogVisible = ref(false)
    // 添加表单的引用
    const addFormRef = ref(null)
    // 添加数据
    const addParams = () => {
      addFormRef.value.validate(async (val) => {
        if (!val) {
          return proxy.$message.error('信息填写错误，信息修改失败')
        }
        // 提交添加信息
        const { data: res } = await proxy.$http.post(
          `categories/${cateId.value}/attributes`,
          {
            attr_name: addForm.attr_name,
            attr_sel: tabActiveName.value,
          }
        )
        console.log(res)
        if (res.meta.status != 201) {
          proxy.$message.error('数据添加失败')
        }
        proxy.$message.success({
          message: '添加改成功',
          type: 'success',
        })
        getParamsData()
        addDialogVisible.value = false
      })
    }
    // 对话框关闭
    const addClose = () => {
      addForm.attr_name = ''
    }

    // =============================================================================
    // 修改的对话框
    // 要修改的数据内容
    const editForm = reactive({
      attr_name: '',
    })
    // 修改表单规则
    const editFormRules = reactive({
      attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    })
    // 控制打开或关闭对话框
    const editDialogVisible = ref(false)
    // 修改表单的引用
    const editFormRef = ref(null)
    // 修改的数据的attrId
    const aId = ref(null)
    // 修改数据
    const editParams = () => {
      editFormRef.value.validate(async (val) => {
        if (!val) {
          return proxy.$message.error('信息填写错误，信息修改失败')
        }
        // 提交添加信息
        const { data: res } = await proxy.$http.put(
          `categories/${cateId.value}/attributes/${aId.value}`,
          {
            attr_name: editForm.attr_name,
            attr_sel: tabActiveName.value,
          }
        )
        if (res.meta.status != 200) {
          proxy.$message.error('数据修改失败')
        }
        proxy.$message.success({
          message: '修改成功',
          type: 'success',
        })
        getParamsData()
        editDialogVisible.value = false
      })
    }
    // 对话框打开
    const editOpen = async (attrId) => {
      aId.value = attrId
      const { data: res } = await proxy.$http.get(
        `categories/${cateId.value}/attributes/${attrId}`,
        {
          params: {
            attr_sel: tabActiveName.value,
          },
        }
      )
      if (res.meta.status != 200) {
        proxy.$message.error('数据获取失败')
      }
      editForm.attr_name = res.data.attr_name
      editDialogVisible.value = true
    }
    // 对话框关闭
    const editClose = () => {
      editForm.attr_name = ''
    }

    // =============================================================================
    // 删除
    const removeParams = async (attrId) => {
      const { data: res } = await proxy.$http.delete(
        `categories/${cateId.value}/attributes/${attrId}`
      )
      if (res.meta.status != 200) {
        proxy.$message.error('数据删除失败')
      }
      proxy.$message.success({
        message: '删除成功',
        type: 'success',
      })
      getParamsData()
    }

    // =============================================================================
    // 添加标签
    // 添加标签输入框标识
    const inputVisible = ref(false)
    // 输入框数据
    const inputValue = ref('')
    // 添加标签输入框的引用
    const saveTagInput = ref(null)

    // 输入完成事件
    const handleInputConfirm = (data) => {
      // 输入的数据无意义就清空数据然后返回
      if (inputValue.value.trim().length === 0) {
        data.inputVisible = false
        inputValue.value = ''
        return
      }

      // 输入正确则把数据添加
      data.attr_vals.push(inputValue.value)
      inputValue.value = ''

      // 向后台提交数据
      saveAttrValue(data)
    }

    // 删除标签
    const removeTag = (data, i) => {
      // 删除数据
      data.attr_vals.splice(i, 1)

      // 向后台提交数据
      saveAttrValue(data)
    }

    // 向后台保存数据
    const saveAttrValue = async (data) => {
      // 把数据提交到后台
      const { data: res } = await proxy.$http.put(
        `categories/${cateId.value}/attributes/${data.attr_id}`,
        {
          attr_name: data.attr_name,
          attr_sel: tabActiveName.value,
          attr_vals: data.attr_vals.join(','),
        }
      )
      if (res.meta.status != 200) {
        proxy.$message.error('数据修改失败')
      }
      proxy.$message.success({
        message: '修改成功',
        type: 'success',
      })
      getParamsData()
    }

    // 添加标签点击事件
    const showInput = (data) => {
      data.inputVisible = true
      // 文本框获得聚焦
      proxy.$nextTick((_) => {
        saveTagInput.value.focus()
      })
    }

    // 解决点击添加标签按钮后页面刷新，数据不展开问题
    // 展开的数据位置
    const expandList = reactive({
      expandList: [],
    })
    // 展开时触发
    const expandChange = (data) => {
      expandList.expandList.includes(data.attr_id)
        ? expandList.expandList.splice(
            expandList.expandList.indexOf(data.attr_id),
            1
          )
        : expandList.expandList.push(data.attr_id)
    }

    // =============================================================================
    // 测试
    function log(d) {
      console.log(d)
    }

    return {
      selectKeys,
      cascaderProps,
      tabActiveName,
      tabButtonDisable,
      addTitle,
      addDialogVisible,
      addForm,
      addFormRules,
      addFormRef,
      editForm,
      editFormRules,
      editDialogVisible,
      editFormRef,
      inputVisible,
      inputValue,
      saveTagInput,
      ...toRefs(expandList),
      ...toRefs(cateList),
      ...toRefs(onlyTableData),
      ...toRefs(manyTableData),
      cascaderChange,
      tabsChange,
      addParams,
      addClose,
      editParams,
      editClose,
      editOpen,
      removeParams,
      handleInputConfirm,
      showInput,
      expandChange,
      removeTag,
      log,
    }
  },
})
</script>

<style scoped>
.cat_op {
  margin-top: 20px;
}
.el-span {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>
