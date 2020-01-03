// import Vue from 'vue';  //加载优化
// import Vuex from 'vuex';  //加载优化
import admin from './modules/admin';

// Vue.use(Vuex);  //加载优化

const store = new Vuex.Store({
	modules: {
		admin
	}
});

export default store
