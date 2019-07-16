<template>
  <div id="app">  
    <el-container>
      <el-aside>
          <h3 class="yk-sys-title">
            <img class="yk-top" src="static/images/logo.png">
            <span class="yk-title">交通信息发布平台</span>
          </h3>
          <el-menu
            default-active="1-1"
            class="el-menu-vertical-demo"
            :default-openeds="openedItems"
            >
            <!-- @open="handleOpen"
            @close="handleClose" -->
            <el-submenu v-for="(item,index) in menuList"  :key="index" :index="index + ''" >
              <template slot="title">
                <i :class="item.ico"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="(sub,skey) in item.children" >
                  <el-menu-item :key="skey" :index="sub.path" @click="navChange(sub);">
                    <div class="yk-sub-title" :class="sub.isCheck ? 'yk-tree-select' : ''">{{sub.name}}</div>
                  </el-menu-item>
                </template>                
              </el-menu-item-group>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <el-header>
            <!-- <div class="yk-header-block">

              <img class="yk-ico-msg" src="static/images/ico-msg.png">
              <label class="yk-label">消息</label>

            </div> -->
            <div class="yk-header-block" @click="showSubMenu();">
              
              <div class="yk-ico-box">
                <img class="yk-ico-user" src="static/images/ico-user.png">  
              </div>              
              <label class="yk-label">
                {{$store.state.userName}}
                <!-- userName -->
              </label>

            </div>

            <!-- <div class="yk-header-block">
              
              <img class="yk-ico-user" src="static/images/ico-logout.png" @click="logoutClick();">              
              <label class="yk-label" @click="logoutClick();">退出</label>

            </div> -->
            
            <!-- v-if="$store.state.isSubMenu" -->
            <!-- <div v-if="$store.state.isSubMenu" class="yk-f-right"> -->
            <div v-if="isSubMenu" class="yk-f-right">
                <ul class="yk-nav yk-sub-menu-box yk-sub-menu">                
                    <li>
                        <img class="yk-user-ico" src="static/images/version.png">
                        <div class="yk-user-title">版本v1.0</div>
                    </li>
                    <li>
                        <img class="yk-user-ico" src="static/images/logout.png">
                        <div class="yk-user-title" title="退出登录" @click="logoutClick();">退出</div>
                    </li>
                </ul>
            </div>

          </el-header>
          <router-view/>
        </el-main>
    </el-container>
  </div>
</template>
<script>
import LocalStorageUtil from '@/store/localstorage.js'
import MenuList from './assets/menu.json'
import { Utils } from '@/common/utils/utils.js'



export default {
  name: 'App',
  data(){
    return {
      openedItems: ['0','1','2'],
      menuList: [],
      collapse: true,
      isSubMenu: false,
    }
  },
  watch: {
    '$store.state.isSubMenu': 'subMenuFn'
  },
  methods: {

    subMenuFn(newVal,oldVal){
      console.log('subMenuFn --- ' + newVal + ' ----- ' + oldVal);
      this.isSubMenu = newVal;
    },

    navChange(item){
      this.$router.push(item.path);
      LocalStorageUtil.setItem('currentMenu',item.path);
      Utils.setMenuByPath(item.path);     
    },

    initMenu(){
        let url = window.location.hash;
        // let url = window.location.pathname;

        console.log('url -- ' + url);
        url = url.slice(1);
        if(!url){
          url = '/infoRelease';
        }
        Utils.setMenuByPath(url);
    },
    logoutClick(){
      this.$router.push('/login');
      
      this.$store.dispatch('logout');
      this.$store.dispatch('showSubMenu',false);
      //  LocalStorageUtil.deleteItem('login');
      LocalStorageUtil.clearItems();

    },
    showSubMenu(){
        let bool = !this.$store.state.isSubMenu;        
        this.$store.dispatch('showSubMenu',bool);
    },
    flushUser(){
      let user = LocalStorageUtil.getItem('login');
      if(!user) return;

      user = JSON.parse(user);
      this.$store.state.userName = user.loginName ? user.loginName : '';
    },

    
  },
  created(){
    
    window.onload = () =>{            
      this.initMenu(); 
      this.flushUser();      
    }

    this.menuList = MenuList;

    

  },
  mounted(){
    this.initMenu();

    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 0px; */
}

.el-container{
  left:0;
  right:0;
  top:0;
  bottom:0;
  position: absolute;
}

.el-container::-webkit-scrollbar{
  width: 1px;
  height: 16px;
  background-color: rgb(47, 48, 48);  
}

.el-aside{
  width: 240px!important;
  background: #101113;
  color: #ffffff;
}
.el-menu {
  text-align: center;
}
.el-menu-item{
  color: #B5B5B5;
}

.el-menu-item-group__title{
  height: 0px;
  padding: 0px;
  display: none;
}

.el-submenu__title{
  /* background: #353585; */
  font-size: 16px;
  color: #B5B5B5!important;
}

.el-main{
  position: relative;
  padding: 0px;
  /* overflow: hidden!important; */
}

.el-header{
  height: 62px!important;
  line-height: 62px!important;
  background: #000;
  padding: 0px;
  text-align: right;
  border-bottom: 1px solid #f2f1f1;
}

.el-menu{
  color: #ffffff!important;
  background: #101113;
  border-right: 0px;
}

/* .is-active{
  color: #fff!important;
  background: #F49308!important;
} */

/* .is-active{
  color: #F59307!important;
} */

.el-menu-item{
  font-size: 16px;
}
.el-menu-item:hover{
    outline: 0 !important;
    background: #21272F !important;
}
.el-menu-item.is-active {
    color: #F59307 !important;
    background: #21272F !important;
    border-right: 3px solid #f59307;
    
}
.el-submenu__title:hover{
    outline: 0 !important;
    background: #21272F !important;
}

.el-submenu__icon-arrow{
  margin-left: 10px;
  right: auto;
}

.el-submenu [class^=el-icon-]{
  width: auto!important;
  margin-right: 0px!important;
}

.yk-tree-select{
  color: #F59307 !important;
}

.yk-menu-item{
  cursor: pointer;
}
.yk-header-block{
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
  width: 160px;
  position: relative;
  text-align: center;
}
.yk-title{
  display: inline-block;
  vertical-align: top;
  height: 38px;
  line-height: 38px;
}
.yk-sys-title{
    margin-top: 0px;
    padding: 12px;
    font-size: 20px;
    background:#000;
    /* background:#21272F; */
}
.yk-top{
  vertical-align: top;
}
.yk-menuItem:hover{
  background:#21272F!important;
}

.yk-ico-msg{
  height: 18px;
  width: 22px;
  top: 21px;
  left: 0px;
  position: absolute;
}
.yk-ico-user{
  width: 22px;
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 3px;
}

.yk-label{
  display: inline-block;
  margin: 0px!important;
  color: #b5afaf;
  cursor: pointer;
}
.yk-label:hover{
  color: #888484;
}
.yk-sub-title{
  margin-left: 27px;
  font-size: 15px;
}

.yk-user-title{
    display: inline-block;
    vertical-align: top;
    color: #e3e8e9;
}

.yk-user-ico{
    margin-top: 8px;
    margin-left: 15px;
    margin-right: 5px;
    width: 20px;
}

.yk-f-right{
    float: right;
}

.yk-nav li{
    display: inline-block;
    vertical-align: top;
    width: 120px;
    height: 55px;
    line-height: 55px;
    text-align: center;
    cursor: pointer;
    color: #475669;
    font-size: 14px;
    text-align: left;       
}
.yk-nav li:hover{
    background: rgb(36, 36, 39);        
}

.yk-border0{
    border: 0!important;
}

.yk-sub-menu-box{
    top: 30px;
    right: 0px;
    position: absolute;
    width: 120px;
    z-index: 9999;
    
}
.yk-sub-menu{
    margin-top: 25px;       
    background: rgb(36, 36, 39);
}
.yk-sub-menu li{
    display: block;
    float:right;        
    width: 160px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    color: #475669;
    font-size: 14px;
    text-align: left;
    /* border-left: 1px solid #454646; */
    /* border-right: 1px solid #454646; */
    border-bottom: 1px solid #454646;
}
.yk-sub-menu li:hover{        
    background: #000000;;
}
.yk-sub-menu li:first-child{
    border-top: 1px solid #454646;        
}
    
.yk-ico-box{
  display: inline-block;
  height: 60px;
  line-height: 60px;
}
</style>
