// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'element-ui/lib/theme-chalk/index.css'
// import 'babel-polyfill' //"babel-polyfill": "^6.26.0",
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import Api from './api/index.js';
import SessionUtil from '@/store/session.js'

// Element-ui
import ElementUI from 'element-ui';  //加载优化
import 'element-ui/lib/theme-chalk/index.css';  //加载优化
Vue.use(ElementUI);  //加载优化

Vue.config.productionTip = false

// Vue.use(ElementUI)

Vue.prototype.$api = Api;
// Vue.prototype.$TDate = TDate;

// 全局静态资源
import '@/assets/scss/reset.scss';
import '@/assets/scss/public.scss';
import '@/assets/scss/element-ui-reset.scss';
import '@/assets/icon-font/iconfont.css';

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
