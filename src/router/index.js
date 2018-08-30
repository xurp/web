import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'

const EmptyLayout = {
  template: '<router-view/>'
}

Vue.use(Router)

export const routes = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/components/Home/Home')
  },
  {
    path: 'position',
    name: 'Position',
    component: EmptyLayout,
    children: [
      {
        path: 'list',
        name: 'Position List',
        component: () => import('@/components/position/index')
      }
    ]
  },
  {
    path: 'resume',
    name: 'Resume',
    component: EmptyLayout,
    children: [
      {
        path: 'edit',
        name: 'Resume edit',
        component: () => import('@/components/resume/index')
      }
    ]
  }
]

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/login/login')
    },
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: routes
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/login/register')
    }
  ]
})
