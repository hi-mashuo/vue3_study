<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="../assets/logo.jpg" alt="" />
      </div>

      <!-- 登录 -->
      <el-form
        label-width="0px"
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="LoginForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <!-- 通过login验证登录表单 -->
          <el-button type="primary" @click="login('LoginForm')">登录</el-button>
          <!-- 通过resetForm方法重置表单，参数为表单的ref -->
          <el-button type="warning" @click="resetForm('LoginForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'Login',

  setup() {
    // 默认输入
    const loginForm = reactive({
      username: 'admin',
      password: '123456',
    })
    // 输入规则
    const loginFormRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
      ],
    })

    function resetForm(formName) {
      this.$refs[formName].resetFields()
    }
    function login(formName) {
      // 加入async，因为await只能在异步函数中使用
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        else {
          // 加入await简化proxy操作
          // 发送post请求
          const { data: res } = await this.$http.post('login', loginForm)
          // 检查状态码
          if (res.meta.status != 200) {
            this.$message.error('登录失败')
          } else {
            this.$message.success({
              message: '登录成功',
              type: 'success',
            })
            // 保存唯一的token
            window.sessionStorage.setItem('token', res.data.token)
            // 跳转到home页面
            this.$router.push('/home')
          }
        }
      })
    }
    return {
      loginForm,
      loginFormRules,
      resetForm,
      login,
    }
  },
})
</script>

<style scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  height: 300px;
  border-radius: 5px;
  background-color: #fff;
  transform: translate(-50%, -50%);
}
.avatar-box {
  position: absolute;
  left: 50%;
  width: 130px;
  height: 130px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.avatar-box img {
  height: 100%;
  transform: translate(-15%);
}
.login-form {
  position: absolute;
  bottom: 35px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.btns {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
</style>
