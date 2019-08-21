<template>
  <div id="login-warpper">
    <img class="login-logo" src="static/images/login-logo.png" />
    <!-- 登录 -->
    <div class="login-card">
      <div class="login-title">智能网联汽车交通管理平台</div>
      <div class="login-item-box">
        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginForm"
          label-position="right"
          label-width="105px"
          class="login-form"
        >
          <el-form-item prop="userNo" label="用户名：" class="login-item">
            <el-input
              type="text"
              v-model.trim="loginForm.userNo"
              :maxlength="40"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：" class="login-item">
            <el-input
              type="password"
              v-model.trim="loginForm.password"
              :maxlength="20"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="login-item login-remember-item">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
        <div class="remember-password"></div>
        <el-button
          class="login-button"
          type="primary"
          :loading="loading"
          @click.native.prevent="handleLogin"
        >登 录</el-button>
      </div>
    </div>
    <img class="footer-info" src="static/images/login-bottom-logo.png" />
  </div>
</template>
<script>
import LocalStorageUtil from "@/store/localstorage.js";

export default {
  name: "Login",
  data() {
    let checkAdminName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写用户名"));
      } else {
        callback();
      }
    };
    let checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      checked: true,
      loginForm: {
        userNo: "",
        password: "",
        platform: ""
      },
      loginRules: {
        name: [{ validator: checkAdminName, trigger: "blur" }],
        pass: [{ validator: checkPassword, trigger: "blur" }]
      },
      loading: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$api.post(
            "sys/user/login",
            {
              userNo: this.loginForm.userNo,
              password: this.loginForm.password,
              platform: "40000"
            },
            response => {
              this.loading = false;
              if (response.status >= 200 && response.status < 300) {
                if (response.data.status == 1) {
                  this.$message.error(response.data.message);
                } else if (response.status == 200) {
                  this.loading = false;
                  let temp = response.data.data;
                  temp = JSON.parse(temp);
                  this.$store.dispatch("login", temp);
                  LocalStorageUtil.setItem("login", temp);
                  LocalStorageUtil.setItem("currentMenu", "/infoRelease");
                  LocalStorageUtil.setItem("currentMenuId", "1");
                  this.$router.push({
                    path: "/infoRelease",
                    params: { key: "登录成功!" }
                  });
                  this.$message.success("登录成功！");
                }
              }
              // else{
              //     this.$store.dispatch('showPrompt',response.message);
              // }
            }
          );
        } else {
          this.loading = false;
          return false;
        }
      });
    }
  },
  mounted() {},
  destroyed() {}
};
</script>
<style lang="scss" scoped>
#login-warpper {
  height: 100%;
  background-image: url("../../static/images/login-bg.jpg");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  .login-logo {
    position: absolute;
    top: 30px;
    left: 50px;
    width: 289px;
  }
  .login-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 0;
    .login-title {
      font-size: 36px;
      height: 46px;
      line-height: 46px;
      color: #fff;
      text-align: center;
    }
    .login-item-box {
      width: 360px;
      padding: 40px 0;
      margin: 0 auto;
      .login-item {
        background-color: transparent;
        border: 1px solid rgba(255, 255, 255, 0.5);
        margin-bottom: 20px;
        &.login-remember-item {
          border: none;
          text-align: right;
        }
      }
    }
    .login-button {
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      background-color: #1fb8df;
      border-radius: 10px;
      font-size: 18px;
      color: #fff;
      border: none;
    }
  }
  .footer-info {
    position: absolute;
    left: 50%;
    bottom: 80px;
    transform: translate(-50%, 0);
    z-index: 1;
    height: 122px;
  }
}
</style>
<style lang="scss">
@import "@/assets/scss/theme.scss";
.login-item-box {
  .el-form-item__label {
    position: relative;
    color: #fff;
    height: 48px;
    padding: 0;
    @include layoutMode();
    &:after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .el-input__inner {
    background: transparent;
    border: none;
    height: 48px;
    padding: 0 21px;
    @include layoutMode(pack);
    color: #fff !important;
    border-radius: 0;
  }
  .login-remember-item {
    .el-form-item__content {
      line-height: 20px;
    }
    .el-checkbox {
      .el-checkbox__label {
        color: #fff;
      }
    }
    .el-checkbox__inner::after {
      border-color: #666;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #fff;
      border-color: #fff;
    }
    .el-checkbox__input.is-disabled.is-checked.el-checkbox__inner {
      background-color: #fff;
      border-color: #fff;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
      border-color: #666;
    }
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #fff;
    }
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #041d44 inset;
    -webkit-text-fill-color: #fff;
  }
}
</style>
