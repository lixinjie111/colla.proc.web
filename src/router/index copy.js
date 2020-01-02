// import Vue from 'vue'  //加载优化
// import VueRouter from 'vue-router'  //加载优化
// Vue.use(VueRouter)  //加载优化

// 不在菜单导航里的路由
const Login = resolve => require(['@/views/login/index'], resolve)
const Err404 = resolve => require(['@/views/error/404'], resolve)
const Home = resolve => require(['@/views/home'], resolve)
//重新加载当前路由
const Refresh = resolve => require(['@/views/refresh'], resolve)
// this.$router.replace({
//     path: '/refresh',
//     params: {
//         t: Date.now()
//     }
// })

// 在菜单导航里的路由
// 首页
const Index = resolve => require(['@/views/index/index'], resolve)

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
        "redirect": "/index",
        "children": [
			  {
          "name": "release",
          "path": "/release",
              "component": release,
              "meta": {
                  "title": "信息发布",
                  "icon": "el-icon-s-promotion",
                  "enable": "Y"
              },
          "children": [
            {
              "name": "infoRelease",
              "path": "/infoRelease",
                  "component": infoRelease,
                  "meta": {
                      "title": "信息发布",
                      "enable": "Y"
                  },
              "children": []
          },
          ]
		    },
            // {
            //     "name": "MenuOne",
            //     "path": "/menu1",
            //     "component": MenuOne,
            //     "redirect": "/menu1/list",
            //     "meta": {
            //         "title": "列表页模板",
            //         "icon": "el-icon-mc-view-list",
            //         "enable": "Y"
            //     },
            //     "children": [
            //         {
            //             "name": "MenuOneList",
            //             "path": "/menu1/list",
            //             "component": MenuOneList,
            //             "meta": {
            //                 "title": "menu--1",
            //                 "enable": "Y"
            //             },
            //             "children": [],
            //         }，{
                    //     "name": "MenuOneAdd",
                    //     "path": "/menu1/add",
                    //     "component": MenuOneAdd,
                    //     "meta": {
                    //         "title": "menu--1--add",
                    //         "enable": "N",      //----------enable控制在菜单栏中是否显示
                    //         "active": "MenuOneList"  //----------action二级菜单中子页面指向的父级
                    //     },
                    //     "children": [],
                    // }
            //     ]
            // }
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
