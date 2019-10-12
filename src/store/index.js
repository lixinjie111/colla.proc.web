// import Vue from 'vue'
// import Vuex from 'vuex'

import { Utils } from '@/common/utils/utils.js'

// Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        login: false,
        user: {
            name: '',
        },
        userName: '',     // 用户信息
        auth: {     // 权限

        },
        action: {   // 页面状态
            isLoading: false,       // 进度条
            isPrompt: false,        // 页面顶部提示框
            msg: '',            // 提示文字
        },
        menus: [],       // 菜单
        isSubMenu: false,   // 显示下拉菜单，版本号、退出登录
        defaultModule: '/vehicleMessage',     // 登录成功，默认打开车辆管理模块vehicleMessage
        breadCrumbs: {},     // 面包屑

        loadingInstance: null,  // loading 实例
        isLoading: false,

        region: {                // 上海嘉定区 310114
            code: 310114,
            position: {
                lon: 121.250333,
                lat: 31.383524
            }
        }
        
    },
    getters: {
        menuList: state => {
            return state.menus;
        }
        
    },
    mutations: {
        login(state,data){
            state.login = data.bool;
            state.userName = data ? data.data.loginName : '';
            state.user = data.data;
        },
        logout(state){
            state.login = false;
            state.userName = '';
            state.user = null;
        },
        initMenus(state,url){
            state.menus = Utils.setMenuByPath(url);
        },
        showLoading(state){
            state.action.isLoading = true;
            state.isLoading = true;
        },
        hideLoading(state){
            state.action.isLoading = false;
            state.isLoading = false;
        },
        showPrompt(state,msg){
            state.action.isPrompt = true;
            state.action.msg = msg;
        },
        hidePrompt(state){
            state.action.isPrompt = false;
            state.action.msg = '';
        },
        showSubMenu(state,bool){
            state.isSubMenu = bool;
        },
        initBreadcrumb(state,data){
            state.breadCrumbs = data;
        }
    },
    actions: {
        login(context,user){
            let temp = {
                type: 'login',
                bool: true,
                data: user
            }
            context.commit('login',temp);
        },
        logout(context){
            // let temp = {
            //     type: 'login',
            //     bool: false,
            //     data: null
            // }
            // context.commit('login',temp);
            context.commit('logout');
        },
        initMenus(context,url){
            context.commit('initMenus',url);
        },
        showLoading(context){
            context.commit('showLoading');
        },
        hideLoading(context){
            context.commit('hideLoading');
        },
        showPrompt(context,msg){
            context.commit('showPrompt',msg);
        },
        hidePrompt(context){
            context.commit('hidePrompt');
        },
        showSubMenu(context,bool){
            
            context.commit('showSubMenu',bool);
        },
        breadCrumbs(context,data){
            context.commit('initBreadcrumb',data);
        }
    }
})

export default store