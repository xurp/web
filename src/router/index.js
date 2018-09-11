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
    name: 'Dashboard',
    component: () => import('@/components/dashboard/dashboard')
  },
  {
    path: 'audit',
    name: 'Audit',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'HR Audit',
        component: () => import('@/components/review/index')
      }
    ]
  },
  {
    path: 'position',
    name: 'Position',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Position List',
        component: () => import('@/components/position/index')
      }
    ]
  },
  {
    path: 'application',
    name: 'Application',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Application List',
        component: () => import('@/components/application/applicationList')
      },
      {
        path: 'applicationlist',
        name: 'Application List',
        component: () => import('@/components/application/applicationList'),
        hidden: true
      },
      {
        path: 'application',
        name: 'Application Detail',
        component: () => import('@/components/application/applicationDetail'),
        hidden: true
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
  },
  {
    path: 'job',
    name: 'Job',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Job List',
        component: () => import('@/components/job/list')
      }
    ]
  },
  {
    path: 'offer',
    name: 'Offer',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Offer List',
        component: () => import('@/components/offer/list')
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
      component: Layout,
      children: routes
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/login/register')
    },
    {
      path: '/black',
      name: 'Black Page',
      component: () => import('@/components/login/blackpage')
    },
    {
      path: '/assess/:id',
      name: 'Assess',
      component: () => import('@/components/assess/assessment')
    }
  ]
})
