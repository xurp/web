import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'

const EmptyLayout = {
  template: '<router-view/>'
}

Vue.use(Router)

export const routes = [
  {
    path: 'position',
    name: 'Position',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Position List',
        component: () => import('@/components/position/index')
      },
      {
        path: 'applicationlist',
        name: 'Application List',
        component: () => import('@/components/position/applicationList'),
        hidden: true
      },
      {
        path: 'application',
        name: 'Application Detail',
        component: () => import('@/components/position/applicationDetail'),
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
    path: 'review',
    name: 'Review',
    component: EmptyLayout,
    children: [
      {
        path: '',
        name: 'Review List',
        component: () => import('@/components/review/index')
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
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/components/Home/Home')
        },
        ...routes
      ]
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
