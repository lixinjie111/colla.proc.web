// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'element-ui/lib/theme-chalk/index.css'
// import 'babel-polyfill' //"babel-polyfill": "^6.26.0",
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
// import Api from './api/index.js';


// Element-ui
import ElementUI from 'element-ui';  //加载优化
import 'element-ui/lib/theme-chalk/index.css';  //加载优化
Vue.use(ElementUI);  //加载优化


Vue.config.productionTip = false

// Vue.use(ElementUI)

// Vue.prototype.$api = Api;
// Vue.prototype.$TDate = TDate;

// 全局静态资源
import '@/assets/scss/reset.scss';
import '@/assets/scss/public.scss';
import '@/assets/scss/element-ui-reset.scss';
import '@/assets/icon-font/iconfont.css';

// 权限
import { setAuthInfo, getAdminId, getAuthInfo, removeAuthInfo } from '@/session/index';
// 在免登录白名单，直接进入
const whiteList = ['/login','/404'];
//取消请求的对象
// axios 过滤器
import  axiosFilter from './api/axiosConfig.js';
//取消请求的对象
window.cancleSource={};
window.cancelToken = axios.CancelToken;
// 路由拦截器
router.beforeEach((to,from,next) => {
    window.cancleSource.cancel && window.cancleSource.cancel()
    window.cancleSource = window.cancelToken.source()
    const ADMINID = getAdminId();
    if(ADMINID) {
        // 回填用户信息
        store.dispatch('setAuthInfo', getAuthInfo());
        if(to.path === '/login') {
            next({path: '/'});
        }else {
            next();
        }
    }else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login'); // 否则全部重定向到登录页
        }
    }
});

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
