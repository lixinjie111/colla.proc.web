<template>
    <div class="yk-box yk-login-box yk-center">
        <div class="yk-middle-box">
            <div class="yk-middle">
                <div class="yk-login">            
                    <form>
                        <div class="yk-form-group yk-login-header yk-center">                    
                            <div class="yk-logo-img-box">
                                <img class="yk-margin-left-30" src="static/images/logo-2.png">                                
                            </div>
                            <div class="yk-title">
                                交通信息发布平台
                            </div>
                        </div>
                        <div class="yk-form-group">
                            <span class="yk-input-title" for="userName">用户名：</span>
                            <input id="userName" name="username" class="yk-login-input yk-margin-10 yk-margin-top-20" v-model="user.name" autocomplete="off" placeholder="请输入用户名">
                        </div>
                        <div class="yk-form-group yk-border-bottom ">
                            <span class="yk-input-title" for="password">密&nbsp;&nbsp;&nbsp;码：</span>
                            <input class="yk-login-input yk-margin-10 yk-margin-bottom-20" id="password" type="password" autocomplete="off" v-model="user.pass" placeholder="请输入密码" @keyup.enter="loginClick();">
                        </div>
                        <div class="yk-form-group yk-center">
                            <span class="yk-btn-login yk-margin-10 yk-margin-top-20" @click="loginClick();">登录</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import LocalStorageUtil from '@/store/localstorage.js'

export default {
    name: 'Login',
    data() {
        return {
            title: '登陆',
            user: this.initUserVo(),
            popData: {
                title:'用户登录',
                type:'user-register',
                data:{
                    id:'',
                    name:'',
                    password:'',
                    passwordOk:''
                }
            }
            // ,
            // logUrl: requeire('./src/assets/images/logo.png')

        }
    },
    methods:{
        initUserVo(){
            return {
                id:'',
                name:'',
                pass:'',
                loginTime:''
            }
        },
        loginClick(){
            
            //跳过登陆直接进入系统
            // this.$router.push('/main');
            // let temp = {
            //     name: 'admin',
            //     pass: 123456
            // }
            // SessionUtils.setItem('login',temp);
            if(!this.user || !this.user.name || !this.user.pass) return;
            this.$api.post('sys/user/login',{
                "userNo": this.user.name,
                "password":this.user.pass,
                'platform':'40000'
            },response => {
                if(response.status >= 200 && response.status < 300){
                    if(response.data.status == 1){
                        this.$message(response.data.message);
                        return;
                    }else if(response.status == 200){
                        let temp = response.data.body;                            
                        temp = JSON.parse(temp);
                        this.$store.dispatch('login',true,temp);
                        LocalStorageUtil.setItem('login',temp);
                        LocalStorageUtil.setItem('currentMenu','/infoRelease');
                        LocalStorageUtil.setItem('currentMenuId','1');
                    
                        // console.log(response.data);
                        // debugger;

                        // LocalStorageUtil.login(tUser);
                        this.$router.push({ path: '/infoRelease' ,params: {key:'登录成功!'}});

                        this.$message('登录成功！');
                    }
                    
                    
                }
                // else{
                //     this.$store.dispatch('showPrompt',response.message);
                // }
            });          
        },
    },
    mounted(){

    },
    destroyed(){

    },
}
</script>
<style scoped>    
    
.yk-box{
    left:0px;
    right:0px;
    top:0px;
    bottom:0px;
    position: absolute;
    text-align: left;
}
.yk-container{
    width: 100%;
    height: 100%;
    position: relative;
    text-align: left;
}

.yk-login-box{
    background:#080808;
    /* background:#00c1de;  */
}
.yk-login{
    width: 560px;
    height: 320px;
    display: inline-block;
    border-radius: 3px;
    color: #f4f7f8;
}
/* 水平居中 */
.yk-center{
    text-align: center!important;
}

/* 垂直居中 父div */
.yk-middle-box{
    width: 100%;
    height: 100%;
    position: relative;
}
.yk-middle{
    position: absolute!important;
    top: 25%;
    transform: translateY(-25%);
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateY(-25%);
    -moz-transform: translateY(-25%);
    -ms-transform: translateY(-25%);
    -o-transform: translateY(-25%);
    -webkit-transform:translateX(-50%);
}

    .yk-btn-login{
        width: 260px;
        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        background: #00c1de;
        border-color: #00c1de; 
        /* background-color: #67bcfd; */               
        /* border-color: #67bcfd;         */
        color: #fff;
        border-radius: 3px;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
    }
    .yk-btn-login:hover{
        background: #33CDE5;
        /* opacity: 0.8; */
    }
    .yk-login-input{
        background: transparent;        
        border: 1px solid #eee;
        box-shadow: none;        
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color:#fff;        
        background-image: none;
        border: 1px solid #585757;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    }
    /* .yk-login-input::placeholder{
        /* color: #a5c8e4; */
        /* color: rgb(157, 223, 243); */
    /*} */
    .yk-form-group {
        display: inline-block;
        width: 100%;
        
    }
    .yk-login-header{        
        border-bottom: 1px dashed #545350;        
        font-family: 'MicrosoftYaHei';
        font-size: 30px;
        font-weight: 100;        
    }
    .yk-login-header div{
        height: 46px;
        line-height: 46px;        
        letter-spacing: 5px;
    }
    .yk-logo-img-box{
        /* display:inline-block; */
        text-align:left;
        margin-top:5px;
    }
    .yk-margin-10{
        margin: 10px;
    }
    .yk-margin-top-20{
        margin-top: 20px;
    }
    .yk-margin-right-30{
        margin-right: 20px;
    }
    .yk-margin-right-50{
        margin-right: 50px;
    }
    .yk-margin-bottom-20{
        margin-bottom: 20px;
    }
    .yk-margin-left-30{
        margin-left:30px;
    }
    .yk-input-title{
        user-select: none;        
    }
    .yk-border-bottom{
        border-bottom: 1px dashed #545350;        
    }
    .yk-title{
        margin-bottom:10px;
        user-select: none;
    }
</style>


