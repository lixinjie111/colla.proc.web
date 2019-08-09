<template>
    <div id="login-warpper">
        <!-- 登录 -->
        <div class="login-card">
            <div class="login-header">
                <!-- <img class="login-logo" src="static/images/login-logo.png">         -->
                <div class="login-title">智能网联汽车交通信息发布平台</div>
            </div>
            <div class="login-item-box">
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="right" label-width="76px" class="login-form">
                    <el-form-item prop="userNo" label="用户名：" class="login-item">
                        <el-input type="text" v-model.trim="loginForm.name" :maxlength="40" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码：" class="login-item">
                        <el-input type="password" v-model.trim="loginForm.pass" :maxlength="20" placeholder="请输入密码" @keyup.enter="loginClick();"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-button class="login-button" type="primary" :loading="loading" @click.native.prevent="loginClick">登录</el-button>
        </div>
        <img class="footer-info" src="../../static/images/login-logo.png"> 
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
        loginClick(){
             this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$api.post('sys/user/login',{
                        "userNo": this.loginForm.name,
                        "password":this.loginForm.pass,
                        'platform':'40000'
                    },response => {
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
<<style lang="scss" scoped>
#login-warpper {
    height: 100%;
    // background-color: #000;
    background-image: url('../../static/images/login-bg.jpg');
    background-repeat: no-repeat;
    background-position: center bottom;
    // background-size: 100% auto;
    background-size: cover;
    .login-card {
        position: absolute;
        top: 25%;
        left: 50%;
        width: 560px;
        transform: translate(-50%, 0);
        padding: 10px 0;
    }
    .login-header{
        padding: 10px 30px;
        border-bottom: 1px dashed #545350; 
        .login-logo {
            // height: 30px;
            margin: 0 auto;
        }
        .login-title {
            font-size: 30px;
            height: 46px;
            line-height: 46px;
            letter-spacing: 5px;
            margin-top: 10px;
            font-family: 'MicrosoftYaHei';
            font-weight: 100;  
            color: #f4f7f8;  
            text-align: center;
        }
    }
    .login-item-box {
        padding: 10px 0;
        border-bottom: 1px dashed #545350;
        .login-form {
            width: 280px;
            margin: 0 auto;
        }
        .login-item {
            padding: 10px 0;
            margin: 0; 
        }
    }
    .login-button {
        display: block;
        width: 286px;
        margin: 20px auto 0;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143; 
        color: #fff;
        background-color: #00c1de;
        border-color: #00c1de;
        border-radius: 3px;
        border: 1px solid #545350;
        border-radius: 4px;
        &:hover{
            background: #33CDE5;
        }
    }
    .footer-info{
        position: absolute;
        left: 50%;
        bottom: 127px;
        transform: translate(-50%, 0);
        z-index: 1;
        height: 162px;
    }
}
</style>
<style lang="scss">
.login-item-box {
    background-color: transparent;
    .el-form-item__label {
        color: #f4f7f8;
    }
    .el-input__inner {
        background: transparent;        
        border: 1px solid #eee;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color:#fff;        
        background-image: none;
        border: 1px solid #585757;        
        border-radius: 4px;
        height: auto;
        overflow: hidden;
        vertical-align: middle;
        box-sizing: border-box;
    }
}
</style>

