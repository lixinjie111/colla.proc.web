<template>
    <div id="login-warpper">
        <img class="login-logo" src="static/images/login-logo.png">
        <div class="login-container">
            <img class="login-bg" src="static/images/login-bg.jpg">
            <div class="login-content">
                <div class="login-left">
                    <p class="login-left-title">智慧互联 启迪云控</p>
                </div>
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-title">交通信息发布平台</div>
                    </div>
                    <div class="login-item-box">
                        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="right" label-width="105px" class="login-form">
                            <el-form-item prop="name" label="用户名：" class="login-item">
                                <el-input type="text" v-model.trim="loginForm.name" :maxlength="40" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                            <el-form-item prop="pass" label="密码：" class="login-item">
                                <el-input type="password" v-model.trim="loginForm.pass" :maxlength="20" placeholder="请输入密码" @keyup.enter="handleLogin"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-button class="login-button" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
                    </div>
                </div>
            </div>
        </div>
         <!-- 登录 -->
    
        <div class="login-bottom">
            <span>建议浏览器：Chrome</span>
            <span>建议分辨率：1920x1080</span>
        </div>
    </div>
</template>
<script>

import LocalStorageUtil from '@/store/localstorage.js'

export default {
    name: 'Login',
    data() {
         let checkAdminName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写用户名'));
            }else {
                callback();
            }
        };
        let checkPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }else {
                callback();
            }
        };
        return {
            loginForm: {
                name:'',
                pass:'',
            },
            loginRules: {
                name: [
                    { validator: checkAdminName, trigger: 'blur' }
                ],
                pass: [
                    { validator: checkPassword, trigger: 'blur' }
                ]
            },
            loading: false
        }
    },
    methods:{
        handleLogin(){
             this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$api.post('sys/user/login',{
                        "userNo": this.loginForm.name,
                        "password":this.loginForm.pass,
                        'platform':'40000'
                    },response => {
                        this.loading = false;
                        if(response.status >= 200 && response.status < 300){
                            if(response.data.status == 1){
                                this.$message.error(response.data.message);
                            }else if(response.status == 200){
                                this.loading = false;
                                let temp = response.data.data;                            
                                temp = JSON.parse(temp);
                                this.$store.dispatch('login',temp);
                                LocalStorageUtil.setItem('login',temp);
                                LocalStorageUtil.setItem('currentMenu','/infoRelease');
                                LocalStorageUtil.setItem('currentMenuId','1');
                                this.$router.push({ path: '/infoRelease' ,params: {key:'登录成功!'}});
                                this.$message.success('登录成功！');
                            }
                        }
                        // else{
                        //     this.$store.dispatch('showPrompt',response.message);
                        // }
                    });
                } else {
                    this.loading = false;
                    return false;
                }
            });
            
        },
    },
    mounted(){

    },
    destroyed(){

    },
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
#login-warpper {
    position: relative;
    height: 100%;
    background-color: #f2f2f2;
    .login-logo {
        position: absolute;
        left: 49px;
        top: 36px;
    }
    .login-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        margin-top: -250px;
        height: 500px;
        .login-bg {
            width: 100%;
            height: 100%;
        }
    }
    .login-bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 30px;
        text-align: center;
        color: #666;
        font-size: 14px;
        span {
            padding: 0 20px;
        }
    }
    .login-content {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        @include layoutMode(between);
        .login-left {
            @include layoutMode();
            width: 65.5%;
            height: 100%;
            .login-left-title {
                color: #fff;
                font-size: 57px;
                letter-spacing: 6px;
                line-height: 90px;
                border-bottom: 4px solid #dcdcdc;
            }
        }
        .login-card {
            position: absolute;
            top: 50%;
            right: 11.67%;
            transform: translate(0, -50%);
            background-color: rgba(255, 255, 255, .5);
            width: 440px;
            line-height: 50px;
        }
    }
    .login-title {
        font-size: 30px;
        height: 80px;
        letter-spacing: 3px;
        background-color: #f2f2f2;
        @include layoutMode();
    }
    .login-item-box {
        padding: 40px 40px 57px;
        .login-item {
            background-color: #fff;
        }
    }
    .login-button {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        background-color: #3293bd;
        border-radius: 10px;
        font-size: 18px;
        letter-spacing: 7px;
        color: #fff;
        border: none;
        margin-top: 30px;
    }
}
</style>
<style lang="scss">
@import "@/assets/scss/theme.scss";
.login-item-box {
    .el-form-item__label {
        position: relative;
        color: #999;
        height: 50px;
        padding: 0;
        @include layoutMode();
        &:after {
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: #bfbfbf;
        }
    }
    .el-input__inner {
        background: transparent;        
        border: none;
        height: 50px;
        padding: 0 21px;
        @include layoutMode(pack);
        color: #333 !important;
    }
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        -webkit-text-fill-color: #333;
    }
}
</style>

