import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: 'infoRelease'
    },
    {
      path: '/infoRelease',
      name: 'InfoRelease',
      component: ()=> import('@/components/release/InfoRelease.vue')
    },
    {
      path: '/infoHistory',
      name: 'InfoHistory',
      component: () => import('@/components/history/InfoHistory.vue')
    },
    {
      path: '/infoType',
      name: 'InfoType',
      component: () => import('@/components/manage/InfoType.vue')
    }
  ]
})
