// import Vue from 'vue'  //加载优化
// import VueRouter from 'vue-router'  //加载优化
// Vue.use(VueRouter)  //加载优化

// 不在菜单导航里的路由
const Login = resolve => require(['@/components/login/index'], resolve)
const Err404 = resolve => require(['@/components/error/404'], resolve)
const Home = resolve => require(['@/components/home'], resolve)
//重新加载当前路由
const Refresh = resolve => require(['@/components/refresh'], resolve)
// this.$router.replace({
//     path: '/refresh',
//     params: {
//         t: Date.now()
//     }
// })

// 在菜单导航里的路由
const Release = resolve => require(['@/components/release/index.vue'], resolve)
const InfoRelease = resolve => require(['@/components/release/components/InfoRelease.vue'], resolve)

const History = resolve => require(['@/components/history/index.vue'], resolve)
const InfoHistory = resolve => require(['@/components/history/components/InfoHistory.vue'], resolve)

const Manage = resolve => require(['@/components/manage/index.vue'], resolve)
const InfoType  = resolve => require(['@/components/manage/components/infoType.vue'], resolve)

// 不在菜单导航里的路由
export const publicRouterMap = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/404', name: '404', component: Err404 },
    { path: '/refresh', name: 'Refresh', component: Refresh},
    { path: '*', redirect: '/404' }
]
// 在菜单导航里的路由
export const menuRouterMap = [
	{
        "path": "/",
      	"name": "home",
        "component": Home,
        "redirect": "/release",
        "children": [
        {
		        "name": "Release",
		        "path": "/release",
            "component": Release,
            "redirect": "/release/infoRelease",
            "meta": {
                "title": "信息发布",
                "icon": "el-icon-s-promotion",
                "enable": "Y"
            },
		        "children": [
              {
                "name": "InfoRelease",
                "path": "/release/infoRelease",
                "component": InfoRelease,
                "meta": {
                    "title": "信息发布",
                    "enable": "Y"
                  },
                  "children": []
              },
            ]
		    },
        {
		        "name": "History",
		        "path": "/history",
            "component": History,
            "redirect": "/history/infoHistory",
            "meta": {
                "title": "信息历史",
                "icon": "el-icon-s-order",
                "enable": "Y"
            },
		        "children": [
              {
                "name": "InfoHistory",
                "path": "/history/infoHistory",
                "component": InfoHistory,
                "meta": {
                    "title": "信息历史",
                    "enable": "Y"
                  },
                  "children": []
              },
            ]
		    },
        {
		        "name": "Manage",
		        "path": "/manage",
            "component": Manage,
            "redirect": "/manage/infoType",
            "meta": {
                "title": "系统配置",
                "icon": "el-icon-s-tools",
                "enable": "Y"
            },
		        "children": [
              {
                "name": "InfoType",
                "path": "/manage/infoType",
                "component": InfoType,
                "meta": {
                    "title": "信息类型",
                    "enable": "Y"
                  },
                  "children": []
              },
            ]
		    },
		]
	}
];

export default new VueRouter({
  // mode: 'history',
  routes: [
  	...publicRouterMap,
  	...menuRouterMap
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
