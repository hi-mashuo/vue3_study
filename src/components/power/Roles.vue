<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 添加角色按钮 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-button type="primary" @click="showAddRoleDialogVisible = true"
          >添加角色</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col>
        <el-table :data="rolesList" style="width: 100%">
          <!-- 扩展 -->
          <el-table-column type="expand">
            <template v-slot="scope">
              <!-- 渲染 -->
              <!-- 添加下边框，如果是第一行再加一个上边框 -->
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
                :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              >
                <!-- 渲染一级 -->
                <el-col :span="5">
                  <el-tag
                    type="primary"
                    class="el-tag"
                    closable
                    @close="delRolesById(scope.row, item1.id)"
                  >
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级 -->
                <el-col :span="19">
                  <!-- 给除了最上边的之外的添加上边框 -->
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                    :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  >
                    <!-- 渲染二级 -->
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        class="el-tag"
                        closable
                        @close="delRolesById(scope.row, item2.id)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染三级 -->
                    <el-col :span="18">
                      <el-col
                        v-for="(item3, i3) in item2.children"
                        :key="item3.id"
                      >
                        <el-tag
                          type="warning"
                          class="el-tag"
                          closable
                          @close="delRolesById(scope.row, item3.id)"
                        >
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 下标 -->
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column label="角色名称" prop="roleName"> </el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
          <el-table-column width="300px" label="操作">
            <template v-slot="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editRoleOpen(scope.row.id)"
                >编辑</el-button
              >

              <el-popconfirm
                title="确定删除该角色吗？"
                @confirm="delRoleByID(scope.row.id)"
                @cancel="notDelRole"
              >
                <template #reference>
                  <el-button size="mini" type="danger" icon="el-icon-delete"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>

              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="setRightsDialogOpen(scope.row.id)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>

  <!-- 分配权限对话框 -->
  <el-dialog
    title="分配权限"
    v-model="showRightsDialogVisible"
    width="50%"
    @close="setRightsDialogClose"
  >
    <!-- 树形控件 -->
    <el-tree
      show-checkbox
      :data="rightsList"
      :props="rightsTreeProps"
      node-key="id"
      default-expand-all
      ref="rightsTree"
    ></el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加角色对话框 -->
  <el-dialog
    title="添加角色"
    v-model="showAddRoleDialogVisible"
    width="50%"
    :before-close="addRoleClose"
    @close="cleanRoleForm"
  >
    <el-form
      ref="addRoleFormRef"
      :model="addRoleForm"
      :rules="addRoleFormRules"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleClose">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 编辑角色对话框 -->
  <el-dialog
    title="编辑角色"
    v-model="showEditRoleDialogVisible"
    width="50%"
    :before-close="editRoleClose"
    @close="cleanRoleForm"
  >
    <el-form
      ref="editRoleFormRef"
      :model="editRoleForm"
      :rules="addRoleFormRules"
    >
      <el-form-item label="角色序号">
        <el-input v-model="editRoleForm.roleId" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showEditRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleClose">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue'

export default defineComponent({
  name: 'Roles',
  setup() {
    const { proxy } = getCurrentInstance()

    // 角色列表
    const rolesList = reactive({
      rolesList: [],
    })
    // 获取角色列表
    const getRolesList = async () => {
      const { data: res } = await proxy.$http.get('roles')
      if (res.meta.status != 200)
        return proxy.$message.error('获取角色列表出错')
      rolesList.rolesList = res.data
    }
    getRolesList()

    // =============================================================================
    // 删除权限
    const delRolesById = (role, iid) => {
      // 删除确认框
      proxy
        .$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          // 确认删除
          const { data: res } = await proxy.$http.delete(
            `roles/${role.id}/rights/${iid}`
          )
          if (res.meta.status != 200)
            return proxy.$message.error('删除失败，' + res.meta.msg)

          // 每次删完界面都会重置
          role.children = res.data
          proxy.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    }

    // =============================================================================
    // 分配权限
    // 分配权限对话框展示
    const showRightsDialogVisible = ref(false)
    // 权限树
    const rightsList = reactive({
      rightsList: [],
    })
    // 获取权限树
    const getRightsList = async () => {
      const { data: res } = await proxy.$http.get('rights/tree')
      if (res.meta.status != 200)
        return proxy.$message.error('获取权限失败', res.meta.msg)
      rightsList.rightsList = res.data
    }
    getRightsList()

    // 默认勾选的权限id
    let defkey = []
    // 树形控件的ref对象
    const rightsTree = ref(null)
    // 被选中的roleId
    let roleId
    // 分配权限对话框打开
    const setRightsDialogOpen = (rid) => {
      showRightsDialogVisible.value = true
      defkey = []
      roleId = rid
      const role = rolesList.rolesList.find((el) => el.id == rid)

      // // 1、使用3级循环算法
      // // 3级循环找到最后一个儿子所有权限的id，然后赋值给defkey
      // role.children.forEach((el1) => {
      //   el1.children.forEach((el2) => {
      //     el2.children.forEach((el3) => {
      //       defkey.push(el3.id)
      //     })
      //   })
      // })

      // 2、使用递归算法
      findChildrenRightsID(role.children)

      // 这里的$refs.rightsTree属性还获取不到，需要设置一个定时器等tree组件展开
      window.setTimeout(() => {
        // proxy.$refs.rightsTree.setCheckedKeys(defkey)
        rightsTree.value.setCheckedKeys(defkey)
      }, 0)
    }
    // 循环递归找最后一个儿子中的权限id
    const findChildrenRightsID = (role) => {
      role.forEach((el1) => {
        if (!el1.children) {
          return defkey.push(el1.id)
        }
        findChildrenRightsID(el1.children)
      })
    }

    // 分配权限对话框关闭
    const setRightsDialogClose = () => {
      // 清空勾选权限id
      rightsTree.value.setCheckedKeys([])
      // proxy.$refs.rightsTree.setCheckedKeys([])
    }

    // 保存分配的权限，发起后端请求
    const allotRights = async () => {
      // 获得所有勾选的权限id
      const keys = [
        ...rightsTree.value.getCheckedKeys(),
        ...rightsTree.value.getHalfCheckedKeys(),
      ]
      // 把权限id变为字符串并用','拼接
      const keysStr = keys.join(',')
      const { data: res } = await proxy.$http.post(`roles/${roleId}/rights`, {
        rids: keysStr,
      })
      if (res.meta.status != 200)
        proxy.$message.error('分配权限失败', res.meta.msg)
      proxy.$message.success({
        message: '分配权限成功',
        type: 'success',
      })
      getRolesList()
      showRightsDialogVisible.value = false
    }

    // 树形控件props
    const rightsTreeProps = reactive({
      children: 'children',
      label: 'authName',
    })

    // =============================================================================
    // 添加角色
    // 控制添加角色对话框显示
    const showAddRoleDialogVisible = ref(false)
    // 角色信息
    const addRoleForm = reactive({
      roleName: '',
      roleDesc: '',
    })
    // 验证规则
    const addRoleFormRules = reactive({
      roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
      ],
      roleDesc: [
        { required: true, message: '请输入角色描述', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
      ],
    })
    // 添加角色对话框关闭，向后台请求添加角色
    const addRoleClose = () => {
      proxy.$refs.addRoleFormRef.validate(async (val) => {
        if (!val) return proxy.$message.error('创建角色失败,请正确填写信息')
        const { data: res } = await proxy.$http.post('roles', addRoleForm)
        if (res.meta.status != 201)
          return proxy.$message.error('创建角色失败' + res.meta.msg)
        proxy.$message.success({
          message: '角色创建成功',
          type: 'success',
        })
        getRolesList()
        showAddRoleDialogVisible.value = false
      })
    }
    // 清空表单
    const cleanRoleForm = () => {
      addRoleForm.roleName = ''
      addRoleForm.roleDesc = ''

      editRoleForm.roleId = ''
      editRoleForm.roleName = ''
      editRoleForm.roleDesc = ''
    }

    // =============================================================================
    // 编辑角色
    // 编辑角色表单数据
    const editRoleForm = reactive({
      roleId: 0,
      roleName: '',
      roleDesc: '',
    })
    // 通过id获取角色信息
    const getRoleByID = async (id) => {
      const { data: res } = await proxy.$http.get('roles/' + id)
      editRoleForm.roleId = res.data.roleId
      editRoleForm.roleName = res.data.roleName
      editRoleForm.roleDesc = res.data.roleDesc
    }
    // 控制编辑角色对话框显示
    const showEditRoleDialogVisible = ref(false)
    // 编辑角色对话框打开
    const editRoleOpen = (id) => {
      getRoleByID(id)
      showEditRoleDialogVisible.value = true
    }
    // 编辑角色对话框关闭，向后台请求编辑角色
    const editRoleClose = () => {
      proxy.$refs.editRoleFormRef.validate(async (val) => {
        if (!val) return proxy.$message.error('编辑角色失败,请正确填写信息')
        const { data: res } = await proxy.$http.put(
          'roles/' + editRoleForm.roleId,
          editRoleForm
        )
        if (res.meta.status != 200)
          return proxy.$message.error('创建角色失败' + res.meta.msg)

        proxy.$message.success({
          message: '角色修改成功',
          type: 'success',
        })
        getRolesList()
        showEditRoleDialogVisible.value = false
      })
    }

    // =============================================================================
    // 删除角色
    // 确定删除角色
    const delRoleByID = async (id) => {
      const { data: res } = await proxy.$http.delete('roles/' + id)
      console.log(res)
      if (res.meta.status != 200)
        return proxy.$message.error('删除角色失败' + res.meta.msg)
      proxy.$message.success({
        message: '角色删除成功',
        type: 'success',
      })
      getRolesList()
    }
    // 取消删除角色
    const notDelRole = () => {
      proxy.$message('角色删除取消')
    }

    return {
      showRightsDialogVisible,
      rightsTreeProps,
      showAddRoleDialogVisible,
      addRoleForm,
      addRoleFormRules,
      showEditRoleDialogVisible,
      editRoleForm,
      rightsTree,
      addRoleClose,
      ...toRefs(rolesList),
      ...toRefs(rightsList),
      delRolesById,
      setRightsDialogOpen,
      setRightsDialogClose,
      cleanRoleForm,
      editRoleClose,
      editRoleOpen,
      delRoleByID,
      notDelRole,
      allotRights,
    }
  },
})
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
