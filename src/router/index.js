import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/Home/Home')
  },
  {
    path: '/b',
    name: 'b',
    children: [
      {
        path: '/c',
        name: 'c'
      },
      {
        path: '/d',
        name: 'd'
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
