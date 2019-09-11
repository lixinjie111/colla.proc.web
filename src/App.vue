<template>
  <div id="app">  
    <template v-if="$route.path != '/login' && $route.path != '/Login'">
        <div id="header">
              <div class="logo">
                  <img src="static/images/logo.png" class="logo-img"/>
                  <!-- <em class="name">服务发布中心</em> -->
              </div>

              <div class="userinfo">
                  <el-dropdown trigger="hover">
                      <span class="el-dropdown-link userinfo-inner">
                          <i class="icon iconfont el-icon-mc-yonghuzhongxin_f c-vertical-middle"></i>
                          <em class="name c-vertical-middle">{{$store.state.userName}}</em>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item divided>版本v1.0</el-dropdown-item>
                          <el-dropdown-item divided @click.native="logoutClick">退出</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
              </div>
        </div>
        <el-container>
          <el-aside>
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
              <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                  <router-view/>
                </div>
              </div>
          </el-main>
        </el-container>
    </template>
    <template v-else>
      <router-view/>
    </template>
  </div>
</template>
<script>
import SessionUtil from '@/store/session.js'
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
  created(){
    
    window.onload = () =>{            
      this.initMenu(); 
      this.flushUser();      
    }

    this.menuList = MenuList;
  },
  mounted(){
    this.initMenu();
  },
  methods: {

    subMenuFn(newVal,oldVal){
      console.log('subMenuFn --- ' + newVal + ' ----- ' + oldVal);
      this.isSubMenu = newVal;
    },

    navChange(item){
      this.$router.push(item.path);
      // SessionUtil.setItem('currentMenu',item.path);
      Utils.setMenuByPath(item.path);     
    },

    initMenu(){
        let url = window.location.hash;
        // let url = window.location.pathname;

        //console.log('url -- ' + url);
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
      //  SessionUtil.deleteItem('login');
      SessionUtil.clearItems();
      localStorage.removeItem("yk-token");

    },
    showSubMenu(){
        let bool = !this.$store.state.isSubMenu;        
        this.$store.dispatch('showSubMenu',bool);
    },
    flushUser(){
      let user = SessionUtil.getItem('login');
      if(!user) return;

      user = JSON.parse(user);
      this.$store.state.userName = user.loginName ? user.loginName : '';
    },
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
#header{
    background: #031636;
    position: relative;
    padding: 11px 20px;
    height: 28px;
    @include layoutMode(between);
    .userinfo {
        .userinfo-inner {
            cursor: pointer;
            color: #999;
            .icon {
                font-size: 28px;
                line-height: 28px;
                margin-right: 10px;
            }
        }
    }
    .logo {
        @include layoutMode(align);
        .logo-img {
            height: 26px;
            margin-right: 10px;
        }
        .name {
            font-size: 24px;
            line-height: 28px;
            color: #fff;
            letter-spacing: 3px;
        }
    }
}

.el-container {
  height: calc(100% - 50px);
}
.el-container::-webkit-scrollbar{
  width: 1px;
  height: 16px;
  background-color: rgb(47, 48, 48);  
}

.el-aside{
  width: 240px!important;
  background: #031636;
  color: #ffffff;
  padding-top: 20px;
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

.el-menu{
  color: #ffffff!important;
  background: #031636;
  border-right: 0px;
  text-align: center;
}

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
    background: #031636 !important;
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

.yk-sub-title{
  margin-left: 27px;
  font-size: 15px;
}

</style>
