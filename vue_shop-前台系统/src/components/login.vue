<template>
  <div class="login_container">
    <h1>崽崽熊后台管理系统</h1>

    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo1.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="form"
        :rules="login_rules"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="iconfont icon-lock_fill"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      form: {
        username: "",
        password: ""
      },
      // 表单验证规则
      login_rules: {
        username: [
          {
            required: true,
            message: "请输入登录昵称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "密码在6 到 15 位之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("/login", this.form);
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("登录失败,用户名或密码不正确");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
        // console.log(this);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  h1 {
    // color: #fff;
    font-size: 40px;
    margin-top: 100px;
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translate(-50%, -50%);
    // 字体颜色渐变
    color: #acb6e5;
    background: -webkit-linear-gradient(90deg, #acb6e5, #86fde8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
