// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'


import Api from './api/index.js';

// import AMap from 'vue-amap';
// Vue.use(AMap);

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$api = Api;

// // 初始化vue-amap
// AMap.initAMapApiLoader({
//   // 申请的高德key
//   key: 'fddb3257dbff99ca1637b565e26d4e3d',  
//   // 插件集合
//   plugin: ['AMap.MapType']
// });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
