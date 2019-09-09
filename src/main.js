// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import store from './store/index.js'

import Api from './api/index.js';
import TDate from './common/date.js';

import SessionUtil from '@/store/session.js'
// import AMap from 'vue-amap';
// Vue.use(AMap);

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$api = Api;
Vue.prototype.$TDate = TDate;

// video视频播放器
import VideoPlayer  from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
Vue.use(VideoPlayer);
// 全局静态资源
import '@/assets/scss/reset.scss';
import '@/assets/scss/public.scss';
import '@/assets/scss/element-ui-reset.scss';
import '@/assets/icon-font/iconfont.css';
import '@/assets/icon-font/iconfont.js';
import '@/assets/scss/map.scss';

// // 初始化vue-amap
// AMap.initAMapApiLoader({
//   // 申请的高德key
//   key: 'fddb3257dbff99ca1637b565e26d4e3d',  
//   // 插件集合
//   plugin: ['AMap.MapType']
// });
// 路由拦截器
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (SessionUtil.getItem('login')) {  // 通过vuex state获取当前的token是否存在
          next();
      }
      else {
          next({
              path: '/login',
              query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
  }
  else {
      next();
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
