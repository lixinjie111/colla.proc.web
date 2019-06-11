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
            >
            <!-- @open="handleOpen"
            @close="handleClose" -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-promotion"></i>
                <span>信息发布</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="navChange('/infoRelease');">信息发布</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>信息历史</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1" @click="navChange('/infoHistory');">信息历史</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-tools"></i>
                <span>系统配置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1" @click="navChange('/infoType');">系统配置</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-header>
            <div class="yk-block">              
              <img class="yk-ico-msg" src="static/images/ico-msg.png">
              消息
            </div>
            <div class="yk-block">              
              <img class="yk-ico-user" src="static/images/ico-user.png">
              用户
            </div>
          </el-header>
          <router-view/>
        </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'App',
  data(){
    return {
      openedItems: ['1-1']
    }
  },
  methods: {
    navChange(path){
      this.$router.push(path);
    }
  },
  created(){
    this.$router.push('/');
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
.el-aside{
  width: 260px!important;
  background: #101113;
  color: #ffffff;
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
  padding: 0px;
}

.el-header{
  height: 62px!important;
  line-height: 62px!important;
  background: #FFFFFF;
  padding: 0px;
  text-align: right;
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


.yk-menu-item{
  cursor: pointer;
}
.yk-block{
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
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
    background:#21272F;
}
.yk-top{
  vertical-align: top;
}
.yk-menuItem:hover{
  background:#21272F!important;
}

.yk-ico-msg{
  height: 18px;
}
.yk-ico-user{
  width: 22px;
}
</style>
