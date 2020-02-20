// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'element-ui/lib/theme-chalk/index.css'
// import 'babel-polyfill' //"babel-polyfill": "^6.26.0",
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
// import Api from './api/index.js';
import SessionUtil from '@/store/session.js'

Vue.config.productionTip = false

// Vue.use(ElementUI)

// Vue.prototype.$api = Api;
// Vue.prototype.$TDate = TDate;

// 全局静态资源
import '@/assets/scss/reset.scss';
import '@/assets/scss/public.scss';
import '@/assets/scss/element-ui-reset.scss';
import '@/assets/icon-font/iconfont.css';

import AddScriptJs from '@/assets/js/utils/addScriptJs';

//取消请求的对象
// axios 过滤器
import  axiosFilter from './api/axiosConfig.js';
//取消请求的对象
window.cancleSource={};
window.cancelToken = axios.CancelToken;
// 路由拦截器
router.beforeEach((to, from, next) => {
    window.cancleSource.cancel && window.cancleSource.cancel()
    window.cancleSource = window.cancelToken.source()
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (SessionUtil.getItem('login')) {  // 通过vuex state获取当前的token是否存在
          if(to.path == '/login') {
              next();
            }else {
              AddScriptJs.add("livePlayer", window.scriptJs.livePlayerUrl, function() {
                  next();
              });
            }
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
const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
// axios 过滤器
axiosFilter(vm);
