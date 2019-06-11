<template>
  <div id="app">  
    <el-container>
      <el-aside>
          <h3>交通信息发布管理平台</h3>
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
              <i class="el-icon-message"></i>消息
            </div>
            <div class="yk-block">
              <i class="el-icon-s-custom"></i>用户
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
  background: #032757;
  color: #ffffff;
}

.el-menu-item-group__title{
  height: 0px;
  padding: 0px;
  display: none;
}

.el-submenu__title{
  /* background: #353585; */
  font-size: 16px;
}

.el-main{
  padding: 0px;
}

.el-header{
  height: 62px!important;
  line-height: 62px!important;
  background: #ccc;
  padding: 0px;
  text-align: right;
}

.el-menu{
  color: #ffffff!important;
}
/* .is-active{
  color: #fff!important;
  background: #F49308!important;
} */



.yk-menu-item{
  cursor: pointer;
}
.yk-block{
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}
</style>
