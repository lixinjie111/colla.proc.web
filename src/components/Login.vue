<template>
  <div id="login-warpper" v-if="visibleFlag">
    <img class="login-logo" src="static/images/login-logo.png" />
    <!-- 登录 -->
    <div class="login-card">
      <div class="login-title">智能网联汽车信息协同中心</div>
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
              auto-complete="new-text"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：" class="login-item">
            <el-input
              type="password"
              v-model.trim="loginForm.password"
              :maxlength="20"
              placeholder="请输入密码"
              auto-complete="new-password"
              @keyup.enter.native="handleLogin"
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

import SessionUtil from '@/store/session.js'

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
        platform: "40000"
      },
      loginRules: {
        userNo: [{ validator: checkAdminName, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }]
      },
      loading: false,
      visibleFlag: false
    };
  },
  created() {
      let _data = localStorage.getItem("yk-token");
      if(_data) {
          let _dataObj = JSON.parse(_data),
              _delayTime = 1000 * 60 * 60 * 24;
          if (new Date().getTime() - _dataObj.time > _delayTime) {
              console.log('信息已过期');
              this.removeStorage();
          }else{
              // 直接调用登录接口
              let _params = {
                  token: _dataObj.data,
                  platform: '40000'
              };
              this.loginFunc(_params);
          }
      } else {
          this.removeStorage();
      }
  },
  mounted() {
    this.getCookie();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.checked === true) {
            this.setCookie(this.loginForm.userNo, this.loginForm.password, 7);
          } else {
            this.clearCookie();
          }
          this.loginFunc(this.loginForm);
        } else {
          this.loading = false;
        }
      });
    },
    loginFunc(params) {
        this.$api.post('openApi/user/login',params,response => {
            this.loading = false;
            if(response.status >= 200 && response.status < 300){
                if(response.data.status == 200){
                    let temp = response.data.data;
                    SessionUtil.setItem('login',JSON.parse(temp));
                    // SessionUtil.setItem('currentMenu','/infoRelease');
                    // SessionUtil.setItem('currentMenuId','1');
                    localStorage.setItem('yk-token', JSON.stringify({data: JSON.parse(temp).token, 'time': new Date().getTime()}));                          
                    
                    this.$router.push('/infoRelease');
                }else {
                    this.$message.error(response.data.message);
                    this.removeStorage();
                }
            }else {
                this.removeStorage();
            }
        },err => {
            this.loading = false;
            this.removeStorage();
        }, "login");
    },
    removeStorage() {
        SessionUtil.clearItems();
        localStorage.removeItem("yk-token");
        this.visibleFlag = true;
    },
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "rememberUserName" +
        "=" +
        c_name +
        ";path=/;expires=" +
        exdate.toGMTString();
      window.document.cookie =
        "rememberUserPwd" +
        "=" +
        c_pwd +
        ";path=/;expires=" +
        exdate.toGMTString();
    },
    //读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "rememberUserName") {
            this.loginForm.userNo = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "rememberUserPwd") {
            this.loginForm.password = arr2[1];
          }
        }
      } else {
        // this.$refs.loginForm.resetFields();
        this.loginForm.userNo = "";
        this.loginForm.password = "";
        this.checked = true;
      }
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    }
  },
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
