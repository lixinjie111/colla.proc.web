// import Vue from 'vue'
// import VueRouter from 'vue-router'

// Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: 'Login'
    },
    {
      path: '/login',
      name: 'Login',
      component: ()=> import('@/components/login/index.vue')
    },
    // {
    //   path: '/',
    //   name: 'index',
    //   redirect: 'infoRelease'
    // },
    {
      path: '/infoRelease',
      name: 'InfoRelease',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: ()=> import('@/components/release/InfoRelease.vue')
    },
    {
      path: '/infoHistory',
      name: 'InfoHistory',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('@/components/history/InfoHistory.vue')
    },
    {
      path: '/infoType',
      name: 'InfoType',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('@/components/manage/InfoType.vue')
    }
  ]
})
