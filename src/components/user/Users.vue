<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <el-row :gutter="12">
      <el-col :span="8">
        <!-- 用户搜索输入框 -->
        <el-input
          placeholder="请输入内容"
          v-model="query"
          clearable
          @change="queryUser"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="queryUser"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>

    <!-- 用户表 -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180"
      ></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <!-- v-slot作用域插槽，用来获取子组件也就是表格中的数据 -->
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="updateUserState(scope.row)"
          >
          </el-switch>
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
            @click="showEditDialog(scope.row)"
          ></el-button>

          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delUser(scope.row.id)"
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="roleDialogOpen(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>

  <!-- 添加用户对话框 -->
  <el-dialog
    title="添加用户"
    v-model="dialogVisible"
    width="50%"
    @close="dialogClose"
  >
    <!-- 添加用户表单 -->
    <!-- 这个地方的ref如果也是addForm的话输入username时值不会改变，输入也有问题 -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改用户信息对话框 -->
  <el-dialog
    title="添加用户"
    v-model="editDialogVisible"
    width="50%"
    @close="dialogClose"
  >
    <!-- 添加用户表单 -->
    <!-- 这个地方的ref如果也是addForm的话输入username时值不会改变，输入也有问题 -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="editFormRef"
      label-width="100px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 角色分配对话框 -->
  <el-dialog title="角色分配" v-model="showRoleDialogFormVisible">
    <el-form :model="UserRoleForm">
      <div>
        <p>当前的用户：{{ UserRoleForm.username }}</p>
        <p>当前的角色：{{ UserRoleForm.roleName }}</p>
        <p>
          分配新角色

          <!-- 角色选择器 -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in UserRoleForm.roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleDialogClose">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, getCurrentInstance, toRefs, ref } from 'vue'

export default defineComponent({
  name: 'Users',
  setup() {
    // 使用proxy获取挂载的axios
    const { proxy } = getCurrentInstance()

    // 用户相关
    const queryInfo = {
      query: '',
      pagenum: 1,
      pagesize: 5,
    }
    const Users = reactive({
      userList: [],
    })
    const total = reactive({
      total: 0,
    })
    // 把pagesize大小传送给分页栏
    const pageSize = ref(queryInfo.pagesize)
    // 查询用户名称
    const query = ref(queryInfo.query)

    // 获取用户列表
    async function getUserList() {
      // get的参数不这样写的话会出错
      const { data: res } = await proxy.$http.get('users', {
        params: queryInfo,
      })
      if (res.meta.status != 200) return proxy.$message.error('res.meta.msg')
      Users.userList = res.data.users
      total.total = res.data.total
    }
    getUserList()

    // 分页
    const handleSizeChange = (newSize) => {
      queryInfo.pagesize = newSize
      getUserList()
    }

    const handleCurrentChange = (newPage) => {
      queryInfo.pagenum = newPage
      getUserList()
    }

    const currentPage4 = (newPage) => {
      queryInfo.pagenum = newPage
      getUserList()
    }

    // 更新用户状态
    const updateUserState = async (data) => {
      const { data: res } = await proxy.$http.put(
        `users/${data.id}/state/${data.mg_state}`
      )
      if (res.meta.status != 200) {
        data.mg_state = !data.mg_state
        proxy.$message.error('用户状态更新失败')
      }
      proxy.$message.success({
        message: '用户状态更新成功',
        type: 'success',
      })
    }

    // 查询用户
    const queryUser = () => {
      queryInfo.query = query.value
      getUserList()
    }

    // =============================================================================
    // 添加用户
    let dialogVisible = ref(false)
    let addForm = reactive({
      username: '',
      password: '',
      email: '',
      mobile: '',
      id: 0,
    })

    // 电话号验证规则
    // 好像并不生效
    const checkPhone = (rule, value, callback) => {
      const reg = `^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$`
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('手机号不能为空'))
    }

    // 表单验证规则
    const addFormRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change'],
        },
      ],
      mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        // { validator: checkPhone, trigger: 'blur' },
        { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
      ],
    })

    // 表单关闭，清除数据
    const dialogClose = () => {
      addForm.username = ''
      addForm.password = ''
      addForm.email = ''
      addForm.mobile = ''
      addForm.id = 0
      // proxy.$refs.addFormRef.resetFields()
    }

    // 添加新用户
    const addUser = () => {
      proxy.$refs.addFormRef.validate(async (val) => {
        if (!val) {
          return proxy.$message.error('信息填写错误，添加用户失败')
        }
        const { data: res } = await proxy.$http.post('users', addForm)
        if (res.meta.status != 201) return proxy.$message.error('添加用户失败')
        proxy.$message.success({
          message: '用户添加成功',
          type: 'success',
        })
        dialogVisible.value = false
      })
    }

    // =============================================================================
    // 用户信息修改
    let editDialogVisible = ref(false)

    // 展示修改用户对话框
    // 直接使用addForm变量，不创建新的变量
    const showEditDialog = (data) => {
      editDialogVisible.value = true
      addForm.username = data.username
      addForm.email = data.email
      addForm.mobile = data.mobile
      addForm.id = data.id
    }

    // 修改用户信息
    const editUser = () => {
      proxy.$refs.editFormRef.validate(async (val) => {
        if (!val) {
          return proxy.$message.error('信息填写错误，信息修改失败')
        }
        const { data: res } = await proxy.$http.put('users/' + addForm.id, {
          id: addForm.id,
          email: addForm.email,
          mobile: addForm.mobile,
        })
        if (res.meta.status != 200)
          return proxy.$message.error('用户信息修改失败')
        proxy.$message.success({
          message: '用户信息修改成功',
          type: 'success',
        })
        // 刷新查询信息
        queryUser()
        editDialogVisible.value = false
      })
    }

    // =============================================================================
    // 删除用户
    const delUser = async (id) => {
      const confirmDel = await proxy
        .$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch((val) => {
          return val
        })
      if (confirmDel == 'cancel') return proxy.$message('取消删除')

      // 向服务器请求删除用户
      const { data: res } = await proxy.$http.delete('users/' + id)
      if (res.meta.status != 200) return proxy.$message.error('删除失败')

      // 刷新查询页面
      queryUser()

      return proxy.$message.success({
        message: '删除成功',
        type: 'success',
      })
    }

    // =============================================================================
    // 分配角色
    const showRoleDialogFormVisible = ref(false)
    // 当前角色
    const UserRoleForm = reactive({
      username: '',
      roleName: '',
      id: 0,
      roles: [],
    })
    // 选中用户ID
    const selectedRoleId = ref()

    // 获得所有角色
    const getRoles = async () => {
      const { data: res } = await proxy.$http.get('roles')
      UserRoleForm.roles = res.data
    }
    getRoles()

    // 打开分配角色对话框
    const roleDialogOpen = (role) => {
      UserRoleForm.username = role.username
      UserRoleForm.roleName = role.role_name
      UserRoleForm.id = role.id

      // 打开对话框
      showRoleDialogFormVisible.value = true
    }

    // 关闭分配角色对话框，保存
    const roleDialogClose = async () => {
      const { data: res } = await proxy.$http.put(
        `users/${UserRoleForm.id}/role`,
        {
          rid: selectedRoleId.value,
        }
      )

      console.log(res)

      if (res.meta.status != 200)
        return proxy.$message.error('角色分配失败' + res.meta.msg)
      proxy.$message.success({
        message: '角色分配成功',
        type: 'success',
      })
      getUserList()
      showRoleDialogFormVisible.value = false
    }

    return {
      pageSize,
      query,
      dialogVisible,
      addForm,
      addFormRules,
      editDialogVisible,
      showRoleDialogFormVisible,
      UserRoleForm,
      selectedRoleId,
      ...toRefs(Users),
      ...toRefs(total),
      handleSizeChange,
      handleCurrentChange,
      currentPage4,
      updateUserState,
      queryUser,
      dialogClose,
      addUser,
      showEditDialog,
      editUser,
      delUser,
      roleDialogOpen,
      roleDialogClose,
    }
  },
})
</script>

<style scoped></style>
